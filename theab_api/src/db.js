const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const DATA_DIR = path.join(__dirname, "..", "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default Empty Collections (no static dummy data)
function getDefaultData() {
  return {
    users: [],
    projects: [],
    guests: [],
    expenses: [],
    gifts: [],
    templates: [],
  };
}

class Database {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error("[Database] Error reading db.json, generating default data:", err.message);
    }
    const defaultData = getDefaultData();
    this.saveData(defaultData);
    return defaultData;
  }

  saveData(dataToSave) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), "utf-8");
    } catch (err) {
      console.error("[Database] Failed to write db.json:", err.message);
    }
  }

  save() {
    this.saveData(this.data);
  }

  getCollection(name) {
    if (!this.data[name]) {
      this.data[name] = [];
      this.save();
    }
    return this.data[name];
  }

  find(collectionName, filterFn) {
    const list = this.getCollection(collectionName);
    return filterFn ? list.filter(filterFn) : list;
  }

  findOne(collectionName, filterFn) {
    const list = this.getCollection(collectionName);
    return list.find(filterFn) || null;
  }

  findById(collectionName, id) {
    return this.findOne(collectionName, (item) => item.id === id);
  }

  insert(collectionName, item) {
    const list = this.getCollection(collectionName);
    const newItem = {
      id: item.id || `${collectionName.slice(0, 4)}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      ...item,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    list.unshift(newItem);
    this.save();
    return newItem;
  }

  updateById(collectionName, id, updates) {
    const list = this.getCollection(collectionName);
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) return null;

    list[index] = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return list[index];
  }

  deleteById(collectionName, id) {
    const list = this.getCollection(collectionName);
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) return false;

    list.splice(index, 1);
    this.save();
    return true;
  }
}

const db = new Database();

module.exports = db;
