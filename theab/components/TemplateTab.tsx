"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Palette,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Music,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Upload,
  X,
  ChevronDown,
  ChevronUp,
  Check,
  Save,
  Maximize2,
  Minimize2,
  Smartphone,
  ExternalLink,
  QrCode,
  ImageIcon,
  Send,
  Eye,
  RotateCcw,
  Loader2,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { ProjectData } from "./CreateProjectModal";
import { api } from "@/app/api-client";

interface TemplateTabProps {
  project: ProjectData;
  onSaveTemplateNotification: (message: string) => void;
}

interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  desc: string;
}

export function TemplateTab({
  project,
  onSaveTemplateNotification,
}: TemplateTabProps) {
  // -------------------------------------------------------------
  // 1. TOP BAR / VIEW STATES
  // -------------------------------------------------------------
  const [selectedTemplate, setSelectedTemplate] = useState("រចនាបថរាជសីមាស (W01)");
  const [isEditorExpanded, setIsEditorExpanded] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // -------------------------------------------------------------
  // 2. COVER TEXT STYLE & COLOR PICKERS (Image 1)
  // -------------------------------------------------------------
  const [coverText, setCoverText] = useState("សូមគោរពអញ្ជើញ");
  const [topColor, setTopColor] = useState("#FBE0B6");
  const [bottomColor, setBottomColor] = useState("#E9A96E");
  const [shadowColor, setShadowColor] = useState("#7A4A2E");
  const [shadowSpread, setShadowSpread] = useState<number>(4);
  const [isShadowOpen, setIsShadowOpen] = useState(false);
  const [buttonColor, setButtonColor] = useState("#705D48");
  const [textColor, setTextColor] = useState("#C6BA7B");
  const [titleTextShadow, setTitleTextShadow] = useState(true);

  // Cover & Background Images
  const [coverImage, setCoverImage] = useState("/backround-template.png");
  const [backgroundImage, setBackgroundImage] = useState("/background2.jpg");

  // -------------------------------------------------------------
  // 3. MAIN HEADER SETTINGS (Image 2)
  // -------------------------------------------------------------
  const [mainTitle, setMainTitle] = useState(
    project.title || (project.groomName ? `ពិធីមង្គលការ ${project.groomName} និង ${project.brideName}` : "")
  );
  const [groomName, setGroomName] = useState(project.groomName || "");
  const [brideName, setBrideName] = useState(project.brideName || "");
  const [isGroomFirst, setIsGroomFirst] = useState(true);
  const [subtitle, setSubtitle] = useState("សូមអញ្ជើញចូលរួមអបអរសាទរថ្ងៃដ៏ពិសេសរបស់យើង");
  const [dateTime, setDateTime] = useState(
    project.date ? (project.time ? `${project.date} at ${project.time}` : project.date) : ""
  );
  const [venueLocation, setVenueLocation] = useState(
    project.venue ? (project.city ? `${project.venue}, ${project.city}` : project.venue) : ""
  );

  // -------------------------------------------------------------
  // 4. INVITATION MESSAGE (Image 2)
  // -------------------------------------------------------------
  const [messageTitle, setMessageTitle] = useState("លិខិតអញ្ជើញចូលរួមពិធីមង្គលការ");
  const [invitationMessage, setInvitationMessage] = useState(
    "យើងខ្ញុំ និងក្រុមគ្រួសារ សូមគោរពអញ្ជើញលោកអ្នកចូលរួមជាភ្ញៀវកិត្តិយសក្នុងពិធីមង្គលការរបស់យើងខ្ញុំ។ វត្តមាន និងពរជ័យដ៏កក់ក្តៅរបស់លោកអ្នក នឹងធ្វើឱ្យពិធីរបស់យើងខ្ញុំពេញលេញ និងមានអត្ថន័យជាទីបំផុត។"
  );

  // -------------------------------------------------------------
  // 5. EVENT SCHEDULE / ITINERARY (Image 3)
  // -------------------------------------------------------------
  const [isScheduleOpen, setIsScheduleOpen] = useState(true);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([
    { id: "s-1", time: "07:00", title: "ពិធីដង្ហែរកូនកំលោះ និងទទួលភ្ញៀវ", desc: "ទទួលកូនកំលោះ និងជំនូនតាមប្រពៃណី" },
    { id: "s-2", time: "09:30", title: "ពិធីចងដៃ និងបំពាក់ចិញ្ចៀន", desc: "សច្ចាប្រណិធាន និងពរជ័យពីចាស់ទុំ" },
    { id: "s-3", time: "17:00", title: "ទទួលភ្ញៀវពេលល្ងាច", desc: "ថតរូបអនុស្សាវរីយ៍ និងទទួលភ្ញៀវ" },
    { id: "s-4", time: "18:30", title: "ពិធីជប់លៀង និងកាត់នំ", desc: "ទទួលទានអាហារ សុន្ទរកថា និងកាត់នំ" },
    { id: "s-5", time: "20:30", title: "តន្ត្រី និងរាំលេងកម្សាន្ត", desc: "រីករាយជាមួយតន្ត្រី និងរាំជុំគ្នា" },
  ]);

  // -------------------------------------------------------------
  // 6. LOCATION & DESIGN MAP (Image 3)
  // -------------------------------------------------------------
  const [googleMapsUrl, setGoogleMapsUrl] = useState("https://maps.app.goo.gl/9Wh42r1JEXaL6PXJ9");
  const [designMapImage, setDesignMapImage] = useState("/design-map.svg");

  // -------------------------------------------------------------
  // 7. PHOTO GALLERY (Image 4)
  // -------------------------------------------------------------
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>([
    "/sample-template.png",
    "/groom-portrait.png",
    "/sample-template.png",
    "/groom-portrait.png",
  ]);

  // -------------------------------------------------------------
  // 8. GRATITUDE MESSAGE (Image 4 & 5)
  // -------------------------------------------------------------
  const [gratitudeTitle, setGratitudeTitle] = useState("ដោយក្តីសោមនស្ស និងអំណរគុណ");
  const [gratitudeMessage, setGratitudeMessage] = useState(
    "យើងខ្ញុំសូមថ្លែងអំណរគុណយ៉ាងជ្រាលជ្រៅចំពោះមាតាបិតា ភ្ញៀវកិត្តិយស ក្រុមគ្រួសារ និងមិត្តភក្តិទាំងអស់ ដែលបានចំណាយពេលវេលាដ៏មានតម្លៃមកចូលរួមអបអរសាទរ។ សូមប្រកបដោយសេចក្តីសុខ សុភមង្គល និងជោគជ័យគ្រប់ប្រការ។"
  );

  // -------------------------------------------------------------
  // 9. KHQR AND GIFT QR CODE (Image 5)
  // -------------------------------------------------------------
  const [khqrUsdImage, setKhqrUsdImage] = useState("/khqr-usd.svg");
  const [khqrKhrImage, setKhqrKhrImage] = useState("/khqr-khr.svg");
  const [bankAccountName, setBankAccountName] = useState(
    project.groomName && project.brideName
      ? `${project.groomName.toUpperCase()} & ${project.brideName.toUpperCase()}`
      : (project.groomName ? project.groomName.toUpperCase() : "")
  );
  const [activeQRTab, setActiveQRTab] = useState<"USD" | "KHR">("USD");
  const [bankName, setBankName] = useState("ABA Bank");

  // -------------------------------------------------------------
  // 10. MUSIC AUDIO SIMULATION
  // -------------------------------------------------------------
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState("Royal Classical Wedding Melody");

  // -------------------------------------------------------------
  // 11. LIVE COUNTDOWN TIMER
  // -------------------------------------------------------------
  const [timeLeft, setTimeLeft] = useState({ days: 42, hours: 3, mins: 37, secs: 24 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // -------------------------------------------------------------
  // 12. RSVP SIMULATION INSIDE PREVIEW
  // -------------------------------------------------------------
  const [previewRsvpName, setPreviewRsvpName] = useState("");
  const [previewRsvpSuccess, setPreviewRsvpSuccess] = useState(false);

  // -------------------------------------------------------------
  // FILE UPLOAD HELPERS
  // -------------------------------------------------------------
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const bgImageInputRef = useRef<HTMLInputElement>(null);
  const designMapInputRef = useRef<HTMLInputElement>(null);
  const khqrUsdInputRef = useRef<HTMLInputElement>(null);
  const khqrKhrInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setter(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setGalleryPhotos((prev) => {
            const next = [...prev];
            next[index] = reader.result as string;
            return next;
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveGalleryPhoto = (index: number) => {
    setGalleryPhotos((prev) => {
      const next = [...prev];
      next[index] = "/backround-template.png";
      return next;
    });
  };

  const [isSaving, setIsSaving] = useState(false);

  const updateScheduleItem = (id: string, updates: Partial<ScheduleItem>) => {
    setScheduleItems((items) => items.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const addScheduleItem = () => {
    setScheduleItems((items) => [
      ...items,
      { id: `schedule-${Date.now()}`, time: "12:00", title: "កម្មវិធីថ្មី", desc: "ពិពណ៌នាអំពីកម្មវិធី" },
    ]);
  };

  const moveScheduleItem = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= scheduleItems.length) return;
    setScheduleItems((items) => {
      const next = [...items];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  };

  // Sync template from backend on project load
  useEffect(() => {
    if (!project?.id) return;
    let isSubscribed = true;

    api.template.get(project.id).then((res) => {
      if (!isSubscribed) return;
      if (res.success && res.data?.template) {
        const t = res.data.template;
        if (t.selectedTemplate) {
          const legacyTemplateNames: Record<string, string> = {
            "Royal Gold Theme (W01)": "រចនាបថរាជសីមាស (W01)",
            "Modern Minimalist (W02)": "រចនាបថសាមញ្ញទាន់សម័យ (W02)",
            "Lotus Blossom Romance (W03)": "រចនាបថផ្កាឈូក (W03)",
          };
          setSelectedTemplate(legacyTemplateNames[t.selectedTemplate] || t.selectedTemplate);
        }
        if (t.coverText) setCoverText(t.coverText);
        if (t.topColor) setTopColor(t.topColor);
        if (t.bottomColor) setBottomColor(t.bottomColor);
        if (t.shadowColor) setShadowColor(t.shadowColor);
        if (t.shadowSpread !== undefined) setShadowSpread(t.shadowSpread);
        if (t.buttonColor) setButtonColor(t.buttonColor);
        if (t.textColor) setTextColor(t.textColor);
        if (t.titleTextShadow !== undefined) setTitleTextShadow(t.titleTextShadow);
        if (t.coverImage) setCoverImage(t.coverImage);
        if (t.backgroundImage) setBackgroundImage(t.backgroundImage);
        if (t.mainTitle) setMainTitle(t.mainTitle);
        if (t.groomName) setGroomName(t.groomName);
        if (t.brideName) setBrideName(t.brideName);
        if (t.isGroomFirst !== undefined) setIsGroomFirst(t.isGroomFirst);
        if (t.subtitle) setSubtitle(t.subtitle);
        if (t.dateTime) setDateTime(t.dateTime);
        if (t.venueLocation) setVenueLocation(t.venueLocation);
        if (t.messageTitle) setMessageTitle(t.messageTitle);
        if (t.invitationMessage) setInvitationMessage(t.invitationMessage);
        if (t.scheduleItems && Array.isArray(t.scheduleItems)) setScheduleItems(t.scheduleItems);
        if (t.googleMapsUrl) setGoogleMapsUrl(t.googleMapsUrl);
        if (t.designMapImage) setDesignMapImage(t.designMapImage);
        if (t.galleryPhotos && Array.isArray(t.galleryPhotos)) setGalleryPhotos(t.galleryPhotos);
        if (t.gratitudeTitle) setGratitudeTitle(t.gratitudeTitle);
        if (t.gratitudeMessage) setGratitudeMessage(t.gratitudeMessage);
        if (t.khqrUsdImage) setKhqrUsdImage(t.khqrUsdImage);
        if (t.khqrKhrImage) setKhqrKhrImage(t.khqrKhrImage);
        if (t.bankAccountName) setBankAccountName(t.bankAccountName);
        if (t.bankName) setBankName(t.bankName);
        if (t.selectedMusic) setSelectedMusic(t.selectedMusic);
      } else {
        if (project.title) setMainTitle(project.title);
        if (project.groomName) setGroomName(project.groomName);
        if (project.brideName) setBrideName(project.brideName);
        if (project.date) setDateTime(project.time ? `${project.date} at ${project.time}` : project.date);
        if (project.venue) setVenueLocation(project.city ? `${project.venue}, ${project.city}` : project.venue);
        if (project.groomName && project.brideName) {
          setBankAccountName(`${project.groomName.toUpperCase()} & ${project.brideName.toUpperCase()}`);
        }
      }
    });

    return () => {
      isSubscribed = false;
    };
  }, [project?.id, project?.groomName, project?.brideName, project?.title, project?.date, project?.time, project?.venue, project?.city]);

  const handleSave = async () => {
    setIsSaving(true);
    const templatePayload = {
      selectedTemplate,
      coverText,
      topColor,
      bottomColor,
      shadowColor,
      shadowSpread,
      buttonColor,
      textColor,
      titleTextShadow,
      coverImage,
      backgroundImage,
      mainTitle,
      groomName,
      brideName,
      isGroomFirst,
      subtitle,
      dateTime,
      venueLocation,
      messageTitle,
      invitationMessage,
      scheduleItems,
      googleMapsUrl,
      designMapImage,
      galleryPhotos,
      gratitudeTitle,
      gratitudeMessage,
      khqrUsdImage,
      khqrKhrImage,
      bankAccountName,
      bankName,
      selectedMusic,
    };

    try {
      if (project?.id) {
        const result = await api.template.save(project.id, templatePayload);
        if (!result.success) {
          throw new Error(result.error || "មិនអាចរក្សាទុកគំរូបានទេ");
        }
      }
      setSavedSuccess(true);
      onSaveTemplateNotification("ការកែតម្រូវលិខិតអញ្ជើញត្រូវបានរក្សាទុករួចរាល់។");
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (e) {
      console.error("Failed to save template to backend:", e);
      onSaveTemplateNotification("មិនអាចរក្សាទុកបានទេ។ សូមពិនិត្យការភ្ជាប់ទៅម៉ាស៊ីនមេ ហើយព្យាយាមម្ដងទៀត។");
    } finally {
      setIsSaving(false);
    }
  };

  // Dynamic names order
  const displayNames = isGroomFirst
    ? `${groomName} & ${brideName}`
    : `${brideName} & ${groomName}`;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* ===================== TOP HEADER / BAR ===================== */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-[#D4AF37]/35 shadow-sm p-3.5 sm:p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#580509] text-[#F5C842] flex items-center justify-center border border-[#D4AF37]/40 shadow-xs">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-[#1F1A1A] tracking-tight">
                គំរូលិខិតអញ្ជើញពិធីមង្គលការ
              </h2>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FBF6EC] border border-[#D4AF37]/40 text-[#580509]">
                ធ្វើបច្ចុប្បន្នភាពភ្លាមៗ
              </span>
            </div>
            <p className="text-xs text-[#6E6262]">
              កែសម្រួលនៅខាងឆ្វេង ហើយមើលលទ្ធផលភ្លាមៗនៅលើទូរសព្ទខាងស្តាំ។
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="px-3 py-1.5 rounded-full border border-[#E8DFD8] text-xs font-semibold text-[#1F1A1A] bg-white outline-none focus:border-[#580509]"
          >
            <option>រចនាបថរាជសីមាស (W01)</option>
            <option>រចនាបថសាមញ្ញទាន់សម័យ (W02)</option>
            <option>រចនាបថផ្កាឈូក (W03)</option>
          </select>

          <button
            onClick={() => setIsEditorExpanded(!isEditorExpanded)}
            className="p-2 rounded-full border border-[#E8DFD8] hover:bg-[#FAF7F2] text-[#6E6262] transition-colors cursor-pointer"
            title={isEditorExpanded ? "បង្រួមកម្មវិធីកែសម្រួល" : "ពង្រីកកម្មវិធីកែសម្រួល"}
            aria-label="ប្ដូរទំហំកម្មវិធីកែសម្រួល"
          >
            {isEditorExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4.5 py-2 rounded-full bg-[#E11D48] hover:bg-[#BE123C] disabled:opacity-50 text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer border border-white/20"
          >
            {isSaving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : savedSuccess ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{isSaving ? "កំពុងរក្សាទុក..." : savedSuccess ? "រក្សាទុករួចរាល់!" : "រក្សាទុក"}</span>
          </button>
        </div>
      </div>

      {/* ===================== TWO-COLUMN SPLIT LAYOUT ===================== */}
      <div className={`grid grid-cols-1 ${isEditorExpanded ? "lg:grid-cols-1" : "lg:grid-cols-12"} gap-6`}>
        {/* ============================================================ */}
        {/* LEFT COLUMN: COMPREHENSIVE EDITOR (5 to 6 Cols)              */}
        {/* ============================================================ */}
        <div className={`${isEditorExpanded ? "w-full max-w-4xl mx-auto" : "lg:col-span-6"} space-y-5`}>
          {/* Editor Header Bar matching user's Image 3 */}
          <div className="bg-[#1F2937] text-white px-4 py-2.5 rounded-2xl flex items-center justify-between shadow-xs">
            <span className="text-xs font-bold tracking-wide uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>កម្មវិធីកែសម្រួលគំរូ</span>
            </span>
            <span className="text-[11px] text-slate-300">
              ការផ្លាស់ប្ដូរទាំងអស់បង្ហាញភ្លាមៗ
            </span>
          </div>

          {/* ---------------- SECTION 1: COVER TEXT STYLE & COLORS (Image 1) ---------------- */}
          <div className="bg-white/98 rounded-3xl border border-[#D4AF37]/35 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#1F1A1A] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#580509]"></span>
                <span>រចនាបថ និងពណ៌អក្សរគម្រប</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setTopColor("#FBE0B6");
                  setBottomColor("#E9A96E");
                  setShadowColor("#7A4A2E");
                  setButtonColor("#705D48");
                  setTextColor("#C6BA7B");
                }}
                className="text-[11px] text-[#580509] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>កំណត់ឡើងវិញ</span>
              </button>
            </div>

            {/* Live Text Style Box matching Image 1 */}
            <div className="bg-[#1F2937] rounded-2xl p-4 text-center border border-slate-700 shadow-inner">
              <span
                className="text-lg sm:text-xl font-bold tracking-wide"
                style={{
                  background: `linear-gradient(180deg, ${topColor} 0%, ${bottomColor} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: titleTextShadow ? `0 ${shadowSpread}px 8px ${shadowColor}` : "none",
                }}
              >
                {coverText}
              </span>
            </div>

            {/* Color Swatches Grid */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              {/* Top Color */}
              <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD8]">
                <label className="block text-[11px] font-bold text-[#6E6262] mb-1.5">ខាងលើ</label>
                <div className="flex items-center justify-center gap-1.5">
                  <input
                    type="color"
                    value={topColor}
                    onChange={(e) => setTopColor(e.target.value)}
                    className="w-6 h-6 rounded-full cursor-pointer border-none bg-transparent"
                  />
                  <input
                    type="text"
                    value={topColor}
                    onChange={(e) => setTopColor(e.target.value)}
                    className="w-16 text-[10px] font-mono text-center bg-white border border-[#E8DFD8] rounded px-1 py-0.5"
                  />
                </div>
              </div>

              {/* Bottom Color */}
              <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD8]">
                <label className="block text-[11px] font-bold text-[#6E6262] mb-1.5">ខាងក្រោម</label>
                <div className="flex items-center justify-center gap-1.5">
                  <input
                    type="color"
                    value={bottomColor}
                    onChange={(e) => setBottomColor(e.target.value)}
                    className="w-6 h-6 rounded-full cursor-pointer border-none bg-transparent"
                  />
                  <input
                    type="text"
                    value={bottomColor}
                    onChange={(e) => setBottomColor(e.target.value)}
                    className="w-16 text-[10px] font-mono text-center bg-white border border-[#E8DFD8] rounded px-1 py-0.5"
                  />
                </div>
              </div>

              {/* Shadow Color */}
              <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD8]">
                <label className="block text-[11px] font-bold text-[#6E6262] mb-1.5">ស្រមោល</label>
                <div className="flex items-center justify-center gap-1.5">
                  <input
                    type="color"
                    value={shadowColor}
                    onChange={(e) => setShadowColor(e.target.value)}
                    className="w-6 h-6 rounded-full cursor-pointer border-none bg-transparent"
                  />
                  <input
                    type="text"
                    value={shadowColor}
                    onChange={(e) => setShadowColor(e.target.value)}
                    className="w-16 text-[10px] font-mono text-center bg-white border border-[#E8DFD8] rounded px-1 py-0.5"
                  />
                </div>
              </div>
            </div>

            {/* Adjust shadow collapsible slider */}
            <div className="border border-slate-100 rounded-xl p-2.5 bg-slate-50">
              <button
                type="button"
                onClick={() => setIsShadowOpen(!isShadowOpen)}
                className="w-full flex items-center justify-between text-xs font-semibold text-[#6E6262] cursor-pointer"
              >
                <span>Adjust shadow depth ({shadowSpread}px)</span>
                {isShadowOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              {isShadowOpen && (
                <div className="pt-2 px-1">
                  <input
                    type="range"
                    min="0"
                    max="16"
                    value={shadowSpread}
                    onChange={(e) => setShadowSpread(Number(e.target.value))}
                    className="w-full accent-[#580509]"
                  />
                </div>
              )}
            </div>

            {/* Button Color & Text Color */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD8] flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-[#1F1A1A]">ពណ៌ប៊ូតុង</p>
                  <p className="text-[10px] text-[#6E6262]">{buttonColor}</p>
                </div>
                <input
                  type="color"
                  value={buttonColor}
                  onChange={(e) => setButtonColor(e.target.value)}
                  className="w-7 h-7 rounded-full cursor-pointer border-none bg-transparent"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD8] flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-[#1F1A1A]">ពណ៌អក្សរ</p>
                  <p className="text-[10px] text-[#6E6262]">{textColor}</p>
                </div>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-7 h-7 rounded-full cursor-pointer border-none bg-transparent"
                />
              </div>
            </div>

            {/* Title Text Shadow Toggle matching Image 1 */}
            <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD8] flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-[#1F1A1A]">ស្រមោលអក្សរចំណងជើង</p>
                <p className="text-[11px] text-[#6E6262] leading-relaxed mt-0.5">
                  Applies to the main title, subtitle, invite line above the guest name, and all section headings (Location, Gallery, KHQR, Wishes).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTitleTextShadow(!titleTextShadow)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                  titleTextShadow ? "bg-[#580509]" : "bg-slate-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    titleTextShadow ? "translate-x-5" : "translate-x-0"
                  }`}
                ></div>
              </button>
            </div>

            {/* Main Cover Image & Background Image Uploads matching Image 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Cover Image Slot */}
              <div className="p-3 rounded-2xl bg-white border border-[#E8DFD8] text-center space-y-2">
                <span className="block text-xs font-bold text-[#1F1A1A]">រូបគម្របសំខាន់</span>
                <div className="relative w-full h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 mx-auto">
                  <Image src={coverImage} alt="Cover preview" fill className="object-cover" />
                </div>
                <div className="flex items-center justify-center gap-2">
                  <input
                    type="file"
                    ref={coverImageInputRef}
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, setCoverImage)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => coverImageInputRef.current?.click()}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#FAF7F2] hover:bg-[#F3E6E6] text-[#580509] text-xs font-semibold border border-[#E8DFD8] cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>បញ្ចូលរូបភាព</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoverImage("/backround-template.png")}
                    className="w-7 h-7 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center cursor-pointer"
                    title="Reset to default"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Background Image Slot */}
              <div className="p-3 rounded-2xl bg-white border border-[#E8DFD8] text-center space-y-2">
                <span className="block text-xs font-bold text-[#1F1A1A]">រូបភាពផ្ទៃក្រោយ</span>
                <div className="relative w-full h-24 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 mx-auto">
                  <Image src={backgroundImage} alt="Background preview" fill className="object-cover" />
                </div>
                <div className="flex items-center justify-center gap-2">
                  <input
                    type="file"
                    ref={bgImageInputRef}
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, setBackgroundImage)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => bgImageInputRef.current?.click()}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#FAF7F2] hover:bg-[#F3E6E6] text-[#580509] text-xs font-semibold border border-[#E8DFD8] cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>បញ្ចូលរូបភាព</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBackgroundImage("/background2.jpg")}
                    className="w-7 h-7 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center cursor-pointer"
                    title="Reset to default"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ---------------- SECTION 2: MAIN HEADER (Image 2) ---------------- */}
          <div className="bg-white/98 rounded-3xl border border-[#D4AF37]/35 shadow-sm p-5 space-y-3.5">
            <h3 className="text-sm font-bold text-[#1F1A1A] flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>ក្បាលលិខិតសំខាន់</span>
            </h3>

            {/* Main Title */}
            <div>
              <label className="block text-xs font-bold text-[#1F1A1A] mb-1">ចំណងជើងសំខាន់</label>
              <input
                type="text"
                value={mainTitle}
                onChange={(e) => setMainTitle(e.target.value)}
                placeholder="e.g. Visal & Sophea Grand Wedding"
                className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] text-xs text-[#1F1A1A] focus:border-[#580509] outline-none"
              />
            </div>

            {/* Couple Names + Order Toggle */}
            <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD8] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1F1A1A]">លំដាប់ឈ្មោះគូស្វាមីភរិយា</span>
                <button
                  type="button"
                  onClick={() => setIsGroomFirst(!isGroomFirst)}
                  className="px-2.5 py-1 rounded-full bg-[#580509] text-[#F5C842] text-[11px] font-semibold cursor-pointer"
                >
                  {isGroomFirst ? "Groom & Bride" : "Bride & Groom"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-[#6E6262] mb-1">ឈ្មោះកូនកំលោះ</label>
                  <input
                    type="text"
                    value={groomName}
                    onChange={(e) => setGroomName(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#E8DFD8] text-xs text-[#1F1A1A] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#6E6262] mb-1">ឈ្មោះកូនក្រមុំ</label>
                  <input
                    type="text"
                    value={brideName}
                    onChange={(e) => setBrideName(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#E8DFD8] text-xs text-[#1F1A1A] bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-xs font-bold text-[#1F1A1A] mb-1">ចំណងជើងរង</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] text-xs text-[#1F1A1A] focus:border-[#580509] outline-none"
              />
            </div>

            {/* Date & Time */}
            <div>
              <label className="block text-xs font-bold text-[#1F1A1A] mb-1">កាលបរិច្ឆេទ និងម៉ោង</label>
              <input
                type="text"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] text-xs text-[#1F1A1A] focus:border-[#580509] outline-none"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-[#1F1A1A] mb-1">ទីតាំង</label>
              <input
                type="text"
                value={venueLocation}
                onChange={(e) => setVenueLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] text-xs text-[#1F1A1A] focus:border-[#580509] outline-none"
              />
            </div>
          </div>

          {/* ---------------- SECTION 3: INVITATION MESSAGE (Image 2) ---------------- */}
          <div className="bg-white/98 rounded-3xl border border-[#D4AF37]/35 shadow-sm p-5 space-y-3.5">
            <h3 className="text-sm font-bold text-[#1F1A1A] flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>សារលិខិតអញ្ជើញ</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-[#1F1A1A] mb-1">ចំណងជើងសារ</label>
              <input
                type="text"
                value={messageTitle}
                onChange={(e) => setMessageTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] text-xs text-[#1F1A1A] focus:border-[#580509] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F1A1A] mb-1">សារអញ្ជើញ</label>
              <textarea
                rows={3}
                value={invitationMessage}
                onChange={(e) => setInvitationMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] text-xs text-[#1F1A1A] focus:border-[#580509] outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* ---------------- SECTION 4: EVENT SCHEDULE / ITINERARY (Image 3) ---------------- */}
          <div className="bg-white/98 rounded-3xl border border-[#D4AF37]/35 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#1F1A1A] flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#580509]" />
                <span>កាលវិភាគ និងលំដាប់កម្មវិធី</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsScheduleOpen(!isScheduleOpen)}
                className="text-xs text-[#6E6262] hover:text-[#580509] cursor-pointer flex items-center gap-1"
              >
                <span>{isScheduleOpen ? "បង្រួម" : "ពង្រីក"}</span>
                {isScheduleOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {isScheduleOpen && (
              <div className="space-y-2.5 pt-1">
                {scheduleItems.map((item, idx) => (
                  <div key={item.id} className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD8] flex items-start gap-2.5">
                    <input
                      type="time"
                      aria-label={`ម៉ោងកម្មវិធីទី ${idx + 1}`}
                      value={item.time}
                      onChange={(e) => updateScheduleItem(item.id, { time: e.target.value })}
                      className="w-24 px-1.5 py-1 rounded-md bg-[#580509] text-[#F5C842] text-[10px] font-bold shrink-0 mt-0.5 outline-none"
                    />
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={item.title}
                        aria-label={`ចំណងជើងកម្មវិធីទី ${idx + 1}`}
                        onChange={(e) => updateScheduleItem(item.id, { title: e.target.value })}
                        className="w-full text-xs font-bold text-[#1F1A1A] bg-transparent outline-none border-b border-transparent focus:border-[#580509]"
                      />
                      <input
                        type="text"
                        value={item.desc}
                        aria-label={`ពិពណ៌នាកម្មវិធីទី ${idx + 1}`}
                        onChange={(e) => updateScheduleItem(item.id, { desc: e.target.value })}
                        className="w-full text-[11px] text-[#6E6262] bg-transparent outline-none mt-0.5"
                      />
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button type="button" onClick={() => moveScheduleItem(idx, -1)} disabled={idx === 0} aria-label="ផ្លាស់ទីឡើង" className="p-1 text-[#580509] disabled:opacity-30"><ArrowUp className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => moveScheduleItem(idx, 1)} disabled={idx === scheduleItems.length - 1} aria-label="ផ្លាស់ទីចុះ" className="p-1 text-[#580509] disabled:opacity-30"><ArrowDown className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => setScheduleItems((items) => items.filter((schedule) => schedule.id !== item.id))} aria-label="លុបកម្មវិធី" className="p-1 text-rose-600 hover:text-rose-800"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addScheduleItem} className="w-full py-2 rounded-xl border border-dashed border-[#D4AF37] text-xs font-bold text-[#580509] hover:bg-[#FAF7F2] flex items-center justify-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  បន្ថែមកម្មវិធី
                </button>
              </div>
            )}
          </div>

          {/* ---------------- SECTION 5: LOCATION & DESIGN MAP (Image 3) ---------------- */}
          <div className="bg-white/98 rounded-3xl border border-[#D4AF37]/35 shadow-sm p-5 space-y-3.5">
            <h3 className="text-sm font-bold text-[#1F1A1A] flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-purple-600"></span>
              <span>ទីតាំង និងផែនទី</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-[#1F1A1A] mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#580509]" />
                <span>តំណភ្ជាប់ Google Maps</span>
              </label>
              <input
                type="text"
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] text-xs text-[#1F1A1A] focus:border-[#580509] outline-none font-mono"
              />
            </div>

            {/* Upload Design Map Optional */}
            <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD8] space-y-2">
              <span className="block text-xs font-bold text-[#1F1A1A]">បញ្ចូលផែនទីរចនា (ជម្រើស)</span>
              <div className="relative w-full h-32 rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                <Image src={designMapImage} alt="Design map route" fill className="object-cover" />
              </div>
              <div className="flex items-center justify-center gap-2 pt-1">
                <input
                  type="file"
                  ref={designMapInputRef}
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setDesignMapImage)}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => designMapInputRef.current?.click()}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white text-[#580509] text-xs font-semibold border border-[#E8DFD8] cursor-pointer"
                >
                  <Upload className="w-3 h-3" />
                  <span>បញ្ចូលផែនទី</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDesignMapImage("/design-map.svg")}
                  className="w-7 h-7 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center cursor-pointer"
                  title="Reset to default map"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* ---------------- SECTION 6: PHOTO GALLERY (Image 4) ---------------- */}
          <div className="bg-white/98 rounded-3xl border border-[#D4AF37]/35 shadow-sm p-5 space-y-3.5">
            <h3 className="text-sm font-bold text-[#1F1A1A] flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-pink-600"></span>
              <span>បណ្ណាល័យរូបភាព (4 រូប)</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {galleryPhotos.map((photo, idx) => (
                <div key={idx} className="p-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD8] text-center space-y-2">
                  <span className="block text-[11px] font-bold text-[#1F1A1A]">Photo {idx + 1}</span>
                  <div className="relative w-full h-24 rounded-xl overflow-hidden bg-slate-200">
                    <Image src={photo} alt={`Gallery ${idx + 1}`} fill className="object-cover" />
                  </div>
                  <div className="flex items-center justify-center gap-1.5">
                    <input
                      type="file"
                      ref={galleryInputRefs[idx]}
                      accept="image/*"
                      onChange={(e) => handleGalleryUpload(idx, e)}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => galleryInputRefs[idx].current?.click()}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-[#580509] text-[10px] font-semibold border border-[#E8DFD8] cursor-pointer"
                    >
                      <Upload className="w-3 h-3" />
                      <span>បញ្ចូល</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryPhoto(idx)}
                      className="w-6 h-6 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ---------------- SECTION 7: GRATITUDE MESSAGE (Image 4 & 5) ---------------- */}
          <div className="bg-white/98 rounded-3xl border border-[#D4AF37]/35 shadow-sm p-5 space-y-3.5">
            <h3 className="text-sm font-bold text-[#1F1A1A] flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
              <span>សារថ្លែងអំណរគុណ</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-[#1F1A1A] mb-1">ចំណងជើងអំណរគុណ</label>
              <input
                type="text"
                value={gratitudeTitle}
                onChange={(e) => setGratitudeTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] text-xs text-[#1F1A1A] focus:border-[#580509] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F1A1A] mb-1">សារថ្លែងអំណរគុណ</label>
              <textarea
                rows={3}
                value={gratitudeMessage}
                onChange={(e) => setGratitudeMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8DFD8] text-xs text-[#1F1A1A] focus:border-[#580509] outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* ---------------- SECTION 8: KHQR AND QR CODES (Image 5) ---------------- */}
          <div className="bg-white/98 rounded-3xl border border-[#D4AF37]/35 shadow-sm p-5 space-y-3.5">
            <h3 className="text-sm font-bold text-[#1F1A1A] flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-rose-600"></span>
              <span>KHQR និងកូដ QR</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Dollar QR */}
              <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD8] text-center space-y-2">
                <span className="block text-xs font-bold text-[#1F1A1A]">KHQR ដុល្លារ ($)</span>
                <div className="relative w-28 h-28 mx-auto rounded-xl overflow-hidden bg-white border border-slate-200 p-1">
                  <Image src={khqrUsdImage} alt="KHQR Dollar" fill className="object-contain p-1" />
                </div>
                <div className="flex items-center justify-center gap-1.5 pt-1">
                  <input
                    type="file"
                    ref={khqrUsdInputRef}
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, setKhqrUsdImage)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => khqrUsdInputRef.current?.click()}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-[#580509] text-xs font-semibold border border-[#E8DFD8] cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>បញ្ចូល</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setKhqrUsdImage("/khqr-usd.svg")}
                    className="w-6 h-6 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Riel QR */}
              <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD8] text-center space-y-2">
                <span className="block text-xs font-bold text-[#1F1A1A]">KHQR រៀល (KHR)</span>
                <div className="relative w-28 h-28 mx-auto rounded-xl overflow-hidden bg-white border border-slate-200 p-1">
                  <Image src={khqrKhrImage} alt="KHQR Riel" fill className="object-contain p-1" />
                </div>
                <div className="flex items-center justify-center gap-1.5 pt-1">
                  <input
                    type="file"
                    ref={khqrKhrInputRef}
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, setKhqrKhrImage)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => khqrKhrInputRef.current?.click()}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-[#580509] text-xs font-semibold border border-[#E8DFD8] cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>បញ្ចូល</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setKhqrKhrImage("/khqr-khr.svg")}
                    className="w-6 h-6 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bank details */}
            <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[#6E6262] mb-1">ឈ្មោះធនាគារ</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#E8DFD8] text-xs text-[#1F1A1A] bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#6E6262] mb-1">ម្ចាស់គណនី</label>
                <input
                  type="text"
                  value={bankAccountName}
                  onChange={(e) => setBankAccountName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#E8DFD8] text-xs text-[#1F1A1A] bg-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: LIVE INTERACTIVE PHONE PREVIEW (6 Cols)        */}
        {/* ============================================================ */}
        <div className={`${isEditorExpanded ? "hidden" : "lg:col-span-6"} flex flex-col items-center sticky top-20`}>
          <div className="w-full max-w-sm mb-2 flex items-center justify-between text-xs font-bold text-[#1F1A1A]">
            <span className="flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-[#580509]" />
              <span>មើលគំរូជាមុន</span>
            </span>
            <span className="text-[11px] font-semibold text-[#6E6262]">
              គំរូទូរសព្ទអន្តរកម្ម
            </span>
          </div>

          {/* Smartphone Frame Outer Shell */}
          <div className="w-full max-w-sm bg-[#1A0102] p-3 rounded-[44px] shadow-[0_25px_70px_rgba(0,0,0,0.5)] border-4 border-[#D4AF37]/60 relative">
            {/* Phone Notch & Speaker */}
            <div className="w-28 h-4 bg-black rounded-b-xl mx-auto mb-2 flex items-center justify-center">
              <div className="w-7 h-1 rounded-full bg-slate-700"></div>
            </div>

            {/* Scrollable Phone Screen */}
            <div
              className="rounded-[30px] overflow-hidden border border-[#D4AF37]/40 relative max-h-[720px] overflow-y-auto text-[#FAF7F2] select-none"
              style={{
                backgroundColor: "#380205",
                backgroundImage: `url(${backgroundImage})`,
                backgroundRepeat: "repeat",
                backgroundSize: "280px 280px",
              }}
            >
              {/* ---------------- 1. HERO / COVER HEADER (Image 1) ---------------- */}
              <div className="relative h-96 w-full overflow-hidden bg-slate-900">
                <Image
                  src={coverImage}
                  alt="រូបគម្របគូស្វាមីភរិយា"
                  fill
                  className="object-cover object-top"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D0204] via-black/20 to-black/40"></div>

                {/* Floating Music Button (Top Right) */}
                <button
                  type="button"
                  onClick={() => setIsPlayingMusic(!isPlayingMusic)}
                  className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-[#F5C842] flex items-center gap-1.5 border border-[#D4AF37]/50 shadow-md cursor-pointer active:scale-95 transition-transform"
                >
                  {isPlayingMusic ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-[#F5C842] animate-pulse" />
                      <span>បើកតន្ត្រី</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                      <span>បិទតន្ត្រី</span>
                    </>
                  )}
                </button>

                {/* Cover Text Header with Live Gradient & Shadow matching Image 1 */}
                <div className="absolute top-10 left-0 right-0 text-center px-4">
                  <h4
                    className="text-xl sm:text-2xl font-bold tracking-wide"
                    style={{
                      background: `linear-gradient(180deg, ${topColor} 0%, ${bottomColor} 100%)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      textShadow: titleTextShadow
                        ? `0 ${shadowSpread}px 10px ${shadowColor}`
                        : "none",
                    }}
                  >
                    {coverText}
                  </h4>
                </div>

                {/* Golden Capsule Pill with Couple Names matching Image 1 */}
                <div className="absolute bottom-16 left-0 right-0 flex justify-center px-4">
                  <div
                    className="px-5 py-2 rounded-full border border-white/60 shadow-lg text-center backdrop-blur-xs"
                    style={{
                      backgroundColor: buttonColor,
                      color: textColor,
                    }}
                  >
                    <span className="text-sm font-bold tracking-wide drop-shadow">
                      {displayNames}
                    </span>
                  </div>
                </div>

                {/* Date & Time below capsule */}
                <div className="absolute bottom-8 left-0 right-0 text-center px-4">
                  <p className="text-[11px] font-semibold text-[#F5C842] drop-shadow">
                    {dateTime}
                  </p>
                </div>

                {/* Animated Scroll Down Badge with Hand Pointing matching Image 1 */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-[#FAF0D7] text-[10px] border border-[#D4AF37]/30 animate-bounce">
                    <span>👆</span>
                    <span>អូសចុះក្រោម</span>
                  </div>
                </div>
              </div>

              {/* ---------------- 2. MAIN HEADER & INVITATION CARD (Image 2) ---------------- */}
              <div className="p-4 sm:p-5 space-y-5 text-center">
                {/* Main Title & Subtitle */}
                <div className="space-y-1.5 pt-2">
                  <h3
                    className="text-base sm:text-lg font-bold tracking-tight text-[#F5C842]"
                    style={{
                      textShadow: titleTextShadow ? `0 2px 8px ${shadowColor}` : "none",
                    }}
                  >
                    {mainTitle}
                  </h3>
                  <p className="text-xs text-[#FAF0D7]/90 leading-relaxed max-w-xs mx-auto">
                    {subtitle}
                  </p>
                </div>

                {/* Invitation Letter Card in Golden Frame */}
                <div className="p-4 rounded-2xl bg-[#2D0204]/90 border border-[#D4AF37]/50 shadow-md space-y-2 backdrop-blur-xs">
                  <div className="inline-block px-3 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F5C842] text-[10px] font-bold uppercase tracking-wider">
                    {messageTitle}
                  </div>
                  <p className="text-xs text-[#FAF0D7] leading-relaxed text-justify">
                    {invitationMessage}
                  </p>
                </div>

                {/* ---------------- 3. LIVE COUNTDOWN TIMER (Image 2) ---------------- */}
                <div className="p-4 rounded-2xl bg-gradient-to-b from-[#4A0408]/90 to-[#2D0204]/90 border border-[#D4AF37]/40 shadow-md backdrop-blur-xs">
                  <p className="text-[11px] font-bold text-[#F5C842] uppercase tracking-wider mb-2.5">
                    រាប់ថយក្រោយដល់ថ្ងៃពិធី
                  </p>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-black/40 border border-[#D4AF37]/30">
                      <span className="block text-lg font-black text-[#F5C842]">{timeLeft.days}</span>
                      <span className="text-[9px] text-[#FAF0D7]/70">ថ្ងៃ</span>
                    </div>
                    <div className="p-2 rounded-xl bg-black/40 border border-[#D4AF37]/30">
                      <span className="block text-lg font-black text-[#F5C842]">{timeLeft.hours}</span>
                      <span className="text-[9px] text-[#FAF0D7]/70">ម៉ោង</span>
                    </div>
                    <div className="p-2 rounded-xl bg-black/40 border border-[#D4AF37]/30">
                      <span className="block text-lg font-black text-[#F5C842]">{timeLeft.mins}</span>
                      <span className="text-[9px] text-[#FAF0D7]/70">នាទី</span>
                    </div>
                    <div className="p-2 rounded-xl bg-black/40 border border-[#D4AF37]/30">
                      <span className="block text-lg font-black text-[#F5C842]">{timeLeft.secs}</span>
                      <span className="text-[9px] text-[#FAF0D7]/70">វិនាទី</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert("បានបន្ថែមទៅប្រតិទិនរបស់អ្នករួចរាល់!")}
                    className="w-full mt-3 py-1.5 rounded-full bg-[#FAF7F2] text-[#380205] text-xs font-bold hover:bg-white transition-colors cursor-pointer"
                  >
                    📅 រក្សាទុកថ្ងៃពិធីក្នុងប្រតិទិន
                  </button>
                </div>

                {/* ---------------- 4. EVENT SCHEDULE SECTION ---------------- */}
                <div className="p-4 rounded-2xl bg-[#2D0204]/90 border border-[#D4AF37]/40 shadow-md text-left space-y-2.5 backdrop-blur-xs">
                  <p className="text-xs font-bold text-[#F5C842] uppercase tracking-wider text-center">
                    កាលវិភាគកម្មវិធី
                  </p>
                  <div className="space-y-2 text-xs">
                    {scheduleItems.map((item) => (
                      <div key={item.id} className="p-2 rounded-xl bg-black/30 border border-[#D4AF37]/20 flex items-start gap-2.5">
                        <span className="text-[10px] font-bold text-[#F5C842] shrink-0 mt-0.5">
                          {item.time}
                        </span>
                        <div>
                          <p className="font-bold text-[#FAF0D7]">{item.title}</p>
                          <p className="text-[10px] text-[#FAF0D7]/70">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ---------------- 5. LOCATION & DESIGN MAP (Image 3) ---------------- */}
                <div className="p-4 rounded-2xl bg-[#2D0204]/90 border border-[#D4AF37]/40 shadow-md space-y-3 backdrop-blur-xs">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#F5C842] uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5 text-[#F5C842]" />
                    <span>ទីតាំងពិធី</span>
                  </div>
                  <p className="text-xs text-[#FAF0D7] font-semibold">{venueLocation}</p>

                  {/* Route Map Graphic */}
                  <div className="relative w-full h-44 rounded-xl overflow-hidden border border-[#D4AF37]/40 shadow-inner">
                    <Image src="/map-template.png" alt="ផែនទីទីតាំងពិធី" fill className="object-cover" />
                  </div>

                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5C842] text-[#380205] text-xs font-bold hover:brightness-105 transition-all shadow-xs"
                  >
                    <span>បើកក្នុង Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* ---------------- 6. PHOTO GALLERY 2x2 (Image 4) ---------------- */}
                <div className="p-4 rounded-2xl bg-[#2D0204]/90 border border-[#D4AF37]/40 shadow-md space-y-3 backdrop-blur-xs">
                  <p className="text-xs font-bold text-[#F5C842] uppercase tracking-wider">
                    បណ្ណាល័យរូបភាពគូស្វាមីភរិយា
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {galleryPhotos.map((photo, idx) => (
                      <div
                        key={idx}
                        className="relative h-32 rounded-xl overflow-hidden border border-[#D4AF37]/30 shadow-xs hover:scale-105 transition-transform duration-300"
                      >
                        <Image src={photo} alt={`រូបភាពគូស្វាមីភរិយាទី ${idx + 1}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* ---------------- 7. GRATITUDE MESSAGE (Image 4 & 5) ---------------- */}
                <div className="p-4 rounded-2xl bg-[#2D0204]/90 border border-[#D4AF37]/40 shadow-md space-y-2 backdrop-blur-xs">
                  <p
                    className="text-xs font-bold text-[#F5C842] uppercase tracking-wider"
                    style={{
                      textShadow: titleTextShadow ? `0 2px 8px ${shadowColor}` : "none",
                    }}
                  >
                    {gratitudeTitle}
                  </p>
                  <p className="text-xs text-[#FAF0D7] leading-relaxed text-justify">
                    {gratitudeMessage}
                  </p>
                </div>

                {/* ---------------- 8. KHQR GIFT ENVELOPE BOX (Image 5) ---------------- */}
                <div className="p-4 rounded-2xl bg-gradient-to-b from-[#380205] to-[#240102] border border-[#D4AF37]/50 shadow-md space-y-3 backdrop-blur-xs">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#F5C842] uppercase tracking-wider">
                    <QrCode className="w-4 h-4 text-[#F5C842]" />
                    <span>ស្រោមសំបុត្រចំណងដៃ (KHQR)</span>
                  </div>

                  {/* USD / KHR Currency Switcher Pills */}
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveQRTab("USD")}
                      className={`px-4 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        activeQRTab === "USD"
                          ? "bg-[#D4AF37] text-[#380205] shadow-xs"
                          : "bg-black/30 text-[#FAF0D7]/70 hover:text-white"
                      }`}
                    >
                      USD ($)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveQRTab("KHR")}
                      className={`px-4 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        activeQRTab === "KHR"
                          ? "bg-[#D4AF37] text-[#380205] shadow-xs"
                          : "bg-black/30 text-[#FAF0D7]/70 hover:text-white"
                      }`}
                    >
                      KHR (រៀល)
                    </button>
                  </div>

                  {/* QR Code White Card matching user's Image 5 */}
                  <div className="bg-white rounded-2xl p-3 shadow-lg border border-[#D4AF37]/40 max-w-[210px] mx-auto text-slate-900">
                    <div className="relative w-44 h-44 mx-auto">
                      <Image
                        src={activeQRTab === "USD" ? khqrUsdImage : khqrKhrImage}
                        alt="KHQR Code"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* Bank info */}
                  <div className="text-center text-[11px] text-[#FAF0D7]/80 pt-1">
                    <p className="font-bold text-[#F5C842]">{bankAccountName}</p>
                    <p>{bankName} &bull; ស្កេនជាមួយកម្មវិធីធនាគារ</p>
                  </div>
                </div>

                {/* ---------------- 9. INTERACTIVE RSVP FORM ---------------- */}
                <div className="p-4 rounded-2xl bg-white/95 text-slate-900 shadow-md space-y-2.5">
                  <p className="text-xs font-bold text-[#580509] uppercase tracking-wider">
                    តើអ្នកនឹងចូលរួមទេ?
                  </p>
                  <input
                    type="text"
                    value={previewRsvpName}
                    onChange={(e) => setPreviewRsvpName(e.target.value)}
                    placeholder="បញ្ចូលឈ្មោះពេញរបស់អ្នក..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-[#580509] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!previewRsvpName.trim()) {
                        alert("សូមបញ្ចូលឈ្មោះរបស់អ្នក ដើម្បីបញ្ជាក់ការចូលរួម!");
                        return;
                      }
                      setPreviewRsvpSuccess(true);
                      setTimeout(() => setPreviewRsvpSuccess(false), 3000);
                    }}
                    className="w-full py-2.5 rounded-full bg-[#580509] hover:bg-[#430205] text-[#F5C842] text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    {previewRsvpSuccess ? "✓ បានបញ្ជាក់ការចូលរួម! សូមអរគុណ!" : "✓ បញ្ជាក់ការចូលរួម (RSVP)"}
                  </button>
                </div>

                <div className="pt-2 pb-4 text-center text-[10px] text-[#FAF0D7]/60">
                  <p>Somboth &bull; ប្រព័ន្ធលិខិតអញ្ជើញពិធីមង្គលការឌីជីថល</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
