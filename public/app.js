// UI States
let currentSessionId = null;
let isStreaming = false;
let sessionsList = [];
let currentUser = null;

// DOM Elements
const sidebar = document.getElementById('sidebar');
const hamburgerBtn = document.getElementById('hamburger-btn');
const closeSidebarBtn = document.getElementById('close-sidebar-btn');
const newChatBtn = document.getElementById('new-chat-btn');
const historyList = document.getElementById('history-list');
const settingsBtn = document.getElementById('settings-btn');
const headerSettingsBtn = document.getElementById('header-settings-btn');
const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');
const languageSelect = document.getElementById('language-select');

// Localization Translations Dictionary
const translations = {
    en: {
        welcomeTitle: "Hello.",
        welcomeSubtitle: "How can I help you today?",
        newChat: "New chat",
        chatAssistant: "Chat Assistant",
        videoGenerator: "Video Generator",
        settings: "Settings",
        typeMessage: "Type a message to THOREX AI...",
        thinking: "THOREX AI is thinking...",
        disclaimer: "THOREX AI may display inaccurate info, so double-check responses.",
        videoTitle: "Create AI Videos",
        videoSubtitle: "Turn your imagination into high-quality cinematic clips using Google Veo",
        videoPromptLabel: "Prompt",
        videoModelLabel: "Veo Model",
        videoAspectLabel: "Aspect Ratio",
        sandboxTitle: "Sandbox Simulation Mode",
        sandboxDesc: "Simulate video generation (No API Key or quota required)",
        generateVideoBtn: "Generate Video",
        suggest1: "Write a Python scraper script for data extraction",
        suggest2: "Explain SQL vs NoSQL databases in simple terms",
        suggest3: "Brainstorm AI business ideas for local services",
        suggest4: "Draft a professional email for a deadline extension"
    },
    hi: {
        welcomeTitle: "नमस्ते.",
        welcomeSubtitle: "आज मैं आपकी क्या सहायता कर सकता हूँ?",
        newChat: "नया चैट",
        chatAssistant: "चैट सहायक",
        videoGenerator: "वीडियो जनरेटर",
        settings: "सेटिंग्स",
        typeMessage: "THOREX AI को एक संदेश लिखें...",
        thinking: "THOREX AI सोच रहा है...",
        disclaimer: "THOREX AI गलत जानकारी दिखा सकता है, इसलिए जवाबों की दोबारा जांच करें।",
        videoTitle: "AI वीडियो बनाएं",
        videoSubtitle: "Google Veo का उपयोग करके अपनी कल्पना को उच्च-गुणवत्ता वाले सिनेमाई क्लिप में बदलें",
        videoPromptLabel: "प्रॉम्ट",
        videoModelLabel: "Veo मॉडल",
        videoAspectLabel: "पहलू अनुपात (Aspect Ratio)",
        sandboxTitle: "सैंडबॉक्स सिमुलेशन मोड",
        sandboxDesc: "वीडियो जनरेशन का अनुकरण करें (कोई API कुंजी या कोटा आवश्यक नहीं)",
        generateVideoBtn: "वीडियो जेनरेट करें",
        suggest1: "डेटा निष्कर्षण के लिए पायथन स्क्रैपर स्क्रिप्ट लिखें",
        suggest2: "सरल शब्दों में SQL बनाम NoSQL डेटाबेस समझाएं",
        suggest3: "स्थानीय सेवाओं के लिए AI व्यवसाय विचारों पर मंथन करें",
        suggest4: "समय सीमा बढ़ाने का अनुरोध करने वाला पेशेवर ईमेल ड्राफ्ट करें"
    },
    mr: {
        welcomeTitle: "नमस्कार.",
        welcomeSubtitle: "आज मी तुम्हाला कशी मदत करू शकतो?",
        newChat: "नवीन चॅट",
        chatAssistant: "चॅट सहाय्यक",
        videoGenerator: "व्हिडिओ जनरेटर",
        settings: "सेटिंग्ज",
        typeMessage: "THOREX AI ला संदेश लिहा...",
        thinking: "THOREX AI विचार करत आहे...",
        disclaimer: "THOREX AI चुकीची माहिती दर्शवू शकते, त्यामुळे प्रतिसादांची खात्री करा.",
        videoTitle: "AI व्हिडिओ तयार करा",
        videoSubtitle: "Google Veo वापरून आपल्या कल्पनेला उच्च दर्जाच्या सिनेमॅटिक क्लिपमध्ये बदला",
        videoPromptLabel: "प्रॉम्प्ट",
        videoModelLabel: "Veo मॉडेल",
        videoAspectLabel: "प्रमाण (Aspect Ratio)",
        sandboxTitle: "सँडबॉक्स सिम्युलेशन मोड",
        sandboxDesc: "व्हिडिओ निर्मितीचे अनुकरण करा (कोणतीही API की आवश्यक नाही)",
        generateVideoBtn: "व्हिडिओ तयार करा",
        suggest1: "डेटा काढण्यासाठी पायथन स्क्रॅपर स्क्रिप्ट लिहा",
        suggest2: "सरल शब्दांत SQL विरुद्ध NoSQL डेटाबेस स्पष्ट करा",
        suggest3: "स्थानिक सेवांसाठी AI व्यवसाय कल्पनांचा विचार करा",
        suggest4: "प्रकल्पाची मुदत वाढवण्यासाठी व्यावसायिक ईमेल तयार करा"
    },
    es: {
        welcomeTitle: "Hola.",
        welcomeSubtitle: "¿Cómo puedo ayudarte hoy?",
        newChat: "Nuevo chat",
        chatAssistant: "Asistente de chat",
        videoGenerator: "Generador de video",
        settings: "Ajustes",
        typeMessage: "Escribe un mensaje para THOREX AI...",
        thinking: "THOREX AI está pensando...",
        disclaimer: "THOREX AI puede mostrar información incorrecta, valide las respuestas.",
        videoTitle: "Crear videos con IA",
        videoSubtitle: "Convierte tu imaginación en clips cinematográficos de alta calidad con Google Veo",
        videoPromptLabel: "Prompt",
        videoModelLabel: "Modelo Veo",
        videoAspectLabel: "Relación de aspecto",
        sandboxTitle: "Modo Simulación Sandbox",
        sandboxDesc: "Simular generación de video (sin clave API ni cuotas)",
        generateVideoBtn: "Generar video",
        suggest1: "Escribe un scraper en Python para la extracción de datos",
        suggest2: "Explica la diferencia entre SQL y NoSQL en términos sencillos",
        suggest3: "Lluvia de ideas de negocios con IA para servicios locales",
        suggest4: "Redacta un correo profesional para pedir una prórroga"
    },
    fr: {
        welcomeTitle: "Bonjour.",
        welcomeSubtitle: "Comment puis-je vous aider aujourd'hui?",
        newChat: "Nouvelle discussion",
        chatAssistant: "Assistant de discussion",
        videoGenerator: "Générateur de vidéo",
        settings: "Paramètres",
        typeMessage: "Écrivez un message à THOREX AI...",
        thinking: "THOREX AI réfléchit...",
        disclaimer: "THOREX AI peut afficher des infos inexactes, veuillez double-vérifier.",
        videoTitle: "Créer des vidéos IA",
        videoSubtitle: "Transformez votre imagination en clips cinématographiques de qualité avec Google Veo",
        videoPromptLabel: "Prompt",
        videoModelLabel: "Modèle Veo",
        videoAspectLabel: "Format d'image",
        sandboxTitle: "Mode de simulation Sandbox",
        sandboxDesc: "Simuler la génération de vidéo (aucune clé API requise)",
        generateVideoBtn: "Générer la vidéo",
        suggest1: "Écrire un script scraper Python pour l'extraction de données",
        suggest2: "Expliquer les bases de données SQL vs NoSQL en termes simples",
        suggest3: "Brainstormer des idées d'entreprises IA pour services locaux",
        suggest4: "Rédiger un e-mail professionnel pour demander un délai"
    },
    de: {
        welcomeTitle: "Hallo.",
        welcomeSubtitle: "Wie kann ich dir heute helfen?",
        newChat: "Neuer Chat",
        chatAssistant: "Chat-Assistent",
        videoGenerator: "Video-Generator",
        settings: "Einstellungen",
        typeMessage: "Schreibe eine Nachricht an THOREX AI...",
        thinking: "THOREX AI überlegt...",
        disclaimer: "THOREX AI kann ungenaue Informationen anzeigen, überprüfe die Antworten.",
        videoTitle: "KI-Videos erstellen",
        videoSubtitle: "Verwandle deine Fantasie mit Google Veo in hochwertige Kinoclips",
        videoPromptLabel: "Prompt",
        videoModelLabel: "Veo-Modell",
        videoAspectLabel: "Seitenverhältnis",
        sandboxTitle: "Sandbox-Simulationsmodus",
        sandboxDesc: "Videogenerierung simulieren (kein API-Schlüssel erforderlich)",
        generateVideoBtn: "Video generieren",
        suggest1: "Schreibe ein Python-Scraper-Skript zur Datenextraktion",
        suggest2: "Erkläre SQL vs. NoSQL-Datenbanken in einfachen Worten",
        suggest3: "Brainstorme KI-Geschäftsideen für lokale Dienstleistungen",
        suggest4: "Entwerfe eine professionelle E-Mail für eine Fristverlängerung"
    },
    ar: {
        welcomeTitle: "مرحباً.",
        welcomeSubtitle: "كيف يمكنني مساعدتك اليوم؟",
        newChat: "محادثة جديدة",
        chatAssistant: "مساعد المحادثة",
        videoGenerator: "منشئ الفيديو",
        settings: "الإعدادات",
        typeMessage: "اكتب رسالة إلى THOREX AI...",
        thinking: "THOREX AI يفكر...",
        disclaimer: "قد يعرض THOREX AI معلومات غير دقيقة، لذا تحقق من الردود.",
        videoTitle: "إنشاء فيديوهات بالذكاء الاصطناعي",
        videoSubtitle: "حول خيالك إلى مقاطع سينمائية عالية الجودة باستخدام Google Veo",
        videoPromptLabel: "الموجه (Prompt)",
        videoModelLabel: "نموذج Veo",
        videoAspectLabel: "نسبة العرض إلى الارتفاع",
        sandboxTitle: "وضع محاكاة الساندبوكس",
        sandboxDesc: "محاكاة توليد الفيديو (لا يلزم وجود مفتاح API أو حصة استخدام)",
        generateVideoBtn: "إنشاء فيديو",
        suggest1: "اكتب نص بايثون لكشط الويب واستخراج البيانات",
        suggest2: "اشرح الفرق بين قواعد البيانات SQL و NoSQL بكلمات بسيطة",
        suggest3: "عصف ذهني لأفكار تجارية بالذكاء الاصطناعي للخدمات المحلية",
        suggest4: "صياغة بريد إلكتروني احترافي لطلب تمديد الموعد النهائي"
    },
    zh: {
        welcomeTitle: "你好。",
        welcomeSubtitle: "今天有什么我可以帮您的吗？",
        newChat: "新对话",
        chatAssistant: "对话助手",
        videoGenerator: "视频生成器",
        settings: "设置",
        typeMessage: "给 THOREX AI 发送消息...",
        thinking: "THOREX AI 正在思考...",
        disclaimer: "THOREX AI 可能会显示不准确的信息，请双击核实。",
        videoTitle: "创建 AI 视频",
        videoSubtitle: "使用 Google Veo 将您的想象力转化为高质量电影片段",
        videoPromptLabel: "提示词",
        videoModelLabel: "Veo 模型",
        videoAspectLabel: "宽高比",
        sandboxTitle: "沙盒模拟模式",
        sandboxDesc: "模拟视频生成（不需要 API 密钥或配额）",
        generateVideoBtn: "生成视频",
        suggest1: "编写 Python 爬虫脚本以进行数据提取",
        suggest2: "用简单的语言解释 SQL 与 NoSQL 数据库的区别",
        suggest3: "头脑风暴将 AI 融入本地服务的商业创意",
        suggest4: "起草一份请求延长项目截止日期的专业邮件"
    },
    ja: {
        welcomeTitle: "こんにちは。",
        welcomeSubtitle: "今日はどのようなご用件でしょうか？",
        newChat: "新しいチャット",
        chatAssistant: "チャットアシスタント",
        videoGenerator: "ビデオジェネレーター",
        settings: "設定",
        typeMessage: "THOREX AI にメッセージを入力...",
        thinking: "THOREX AI が考えています...",
        disclaimer: "THOREX AI は不正確な情報を表示する場合があるため、確認してください。",
        videoTitle: "AIビデオ作成",
        videoSubtitle: "Google Veoを使用してあなたの想像力を高品質の映画風クリップに変換",
        videoPromptLabel: "プロンプト",
        videoModelLabel: "Veoモデル",
        videoAspectLabel: "アスペクト比",
        sandboxTitle: "サンドボックスシミュレーションモード",
        sandboxDesc: "ビデオ生成をシミュレート（APIキーやクォータは不要）",
        generateVideoBtn: "ビデオ生成",
        suggest1: "データ抽出用のPythonスクレイパーの作成支援",
        suggest2: "SQLとNoSQLデータベースの違いをわかりやすく説明",
        suggest3: "地域サービスでAIを活用するビジネスアイデアの提案",
        suggest4: "プロジェクト締め切り延長を依頼するビジネスメール作成"
    },
    ru: {
        welcomeTitle: "Привет.",
        welcomeSubtitle: "Чем я могу помочь вам сегодня?",
        newChat: "Новый чат",
        chatAssistant: "Чат-ассистент",
        videoGenerator: "Видеогенератор",
        settings: "Настройки",
        typeMessage: "Введите сообщение для THOREX AI...",
        thinking: "THOREX AI думает...",
        disclaimer: "THOREX AI может предоставлять неточную информацию, перепроверяйте ответы.",
        videoTitle: "Создание AI-видео",
        videoSubtitle: "Превратите свое воображение в качественные кинокадры с помощью Google Veo",
        videoPromptLabel: "Промпт",
        videoModelLabel: "Модель Veo",
        videoAspectLabel: "Соотношение сторон",
        sandboxTitle: "Режим симуляции в песочнице",
        sandboxDesc: "Имитировать генерацию видео (без ключа API или квот)",
        generateVideoBtn: "Создать видео",
        suggest1: "Написать парсер на Python для сбора данных",
        suggest2: "Простыми словами объяснить разницу между SQL и NoSQL",
        suggest3: "Обсудить бизнес-идеи с ИИ для локальных услуг",
        suggest4: "Составить деловое письмо для продления срока проекта"
    },
    pt: {
        welcomeTitle: "Olá.",
        welcomeSubtitle: "Como posso ajudar você hoje?",
        newChat: "Nova conversa",
        chatAssistant: "Assistente de chat",
        videoGenerator: "Gerador de vídeo",
        settings: "Configurações",
        typeMessage: "Digite uma mensagem para THOREX AI...",
        thinking: "THOREX AI está pensando...",
        disclaimer: "THOREX AI pode exibir informações incorretas, verifique as respostas.",
        videoTitle: "Criar vídeos com IA",
        videoSubtitle: "Transforme a sua imaginação em clipes cinematográficos de alta qualidade com o Google Veo",
        videoPromptLabel: "Prompt",
        videoModelLabel: "Modelo Veo",
        videoAspectLabel: "Proporção de tela",
        sandboxTitle: "Modo Simulação Sandbox",
        sandboxDesc: "Simular a geração de vídeo (sem necessidade de chave de API)",
        generateVideoBtn: "Gerar vídeo",
        suggest1: "Escrever um script web scraper em Python para extrair dados",
        suggest2: "Explicar a diferença entre SQL e NoSQL de forma simples",
        suggest3: "Ideias de negócios de IA aplicados a serviços locais",
        suggest4: "Redigir um e-mail formal solicitando extensão do prazo"
    },
    bn: {
        welcomeTitle: "হ্যালো.",
        welcomeSubtitle: "আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
        newChat: "নতুন চ্যাট",
        chatAssistant: "চ্যাট অ্যাসিস্ট্যান্ট",
        videoGenerator: "ভিডিও জেনারেটর",
        settings: "সেটিংস",
        typeMessage: "THOREX AI-কে একটি বার্তা লিখুন...",
        thinking: "THOREX AI চিন্তা করছে...",
        disclaimer: "THOREX AI ভুল তথ্য প্রদর্শন করতে পারে, তাই তথ্যগুলো যাচাই করুন।",
        videoTitle: "AI ভিডিও তৈরি করুন",
        videoSubtitle: "Google Veo ব্যবহার করে আপনার কল্পনাকে উচ্চমানের সিনেমাটিক ক্লিপে রূপান্তর করুন",
        videoPromptLabel: "প্রম্পট",
        videoModelLabel: "Veo মডেল",
        videoAspectLabel: "অ্যাসপেক্ট রেশিও",
        sandboxTitle: "স্যান্ডবক্স সিমুলেশন মোড",
        sandboxDesc: "ভিডিও তৈরি সিমুলেট করুন (কোনো API কি বা কোটা লাগবে না)",
        generateVideoBtn: "ভিডিও তৈরি করুন",
        suggest1: "উপাত्त সংগ্রহের জন্য একটি পাইথন স্ক্র্যাপার স্ক্রিপ্ট লিখুন",
        suggest2: "সহজ ভাষায় SQL এবং NoSQL ডাটাबेসের পার্থক্য ব্যাখ্যা করুন",
        suggest3: "আঞ্চলিক সেবায় AI ব্যবহার করে ব্যবসার আইডিয়া বের করুন",
        suggest4: "প্রজেক্টের সময়সীমা বাড়ানোর অনুরোধ জানিয়ে একটি পেশাদার ইমেইল লিখুন"
    },
    ta: {
        welcomeTitle: "வணக்கம்.",
        welcomeSubtitle: "இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?",
        newChat: "புதிய அரட்டை",
        chatAssistant: "அரட்டை உதவியாளர்",
        videoGenerator: "வீடியோ ஜெனரேட்டர்",
        settings: "அமைப்புகள்",
        typeMessage: "THOREX AI-க்கு ஒரு செய்தியை தட்டச்சு செய்யவும்...",
        thinking: "THOREX AI யோசிக்கிறது...",
        disclaimer: "THOREX AI தவறான தகவலைக் காட்டலாம், பதில்களைச் சரிபார்க்கவும்.",
        videoTitle: "AI வீடியோக்களை உருவாக்கு",
        videoSubtitle: "Google Veo ஐப் பயன்படுத்தி உங்கள் கற்பனையை உயர்தர சினிமா கிளிப்களாக மாற்றவும்",
        videoPromptLabel: "ப்ராம்ப்ட் (விளக்கம்)",
        videoModelLabel: "Veo மாடல்",
        videoAspectLabel: "பக்க விகிதம்",
        sandboxTitle: "சாண்ட்பாக்ஸ் உருவகப்படுத்துதல் பயன்முறை",
        sandboxDesc: "வீடியோ உருவாக்கத்தை உருவகப்படுத்துங்கள் (API கீ தேவையில்லை)",
        generateVideoBtn: "வீடியோவை உருவாக்கு",
        suggest1: "தரவு பிரித்தெடுப்பதற்காக பைதான் ஸ்கிராப்பர் ஸ்கிரிப்ட் எழுதுங்கள்",
        suggest2: "SQL மற்றும் NoSQL தரவுத்தளங்களுக்கு இடையிலான வேறுபாட்டை எளிமையாக விளக்குங்கள்",
        suggest3: "உள்ளூர் சேவைகளில் AI ஐ இணைக்கும் வணிக யோசனைகளை உருவாக்குங்கள்",
        suggest4: "திட்ட காலக்கெடு நீட்டிப்பைக் கோரும் தொழில்முறை மின்னஞ்சலை எழுதுங்கள்"
    },
    te: {
        welcomeTitle: "నమస్కారం.",
        welcomeSubtitle: "ఈ రోజు నేను మీకు ఎలా సహాయపడగలను?",
        newChat: "కొత్త చాట్",
        chatAssistant: "చాట్ అసిస్టెంట్",
        videoGenerator: "వీడియో జనరేటర్",
        settings: "సెట్టింగులు",
        typeMessage: "THOREX AIకి సందేశాన్ని టైప్ చేయండి...",
        thinking: "THOREX AI ఆలోచిస్తోంది...",
        disclaimer: "THOREX AI తప్పుడు సమాచారాన్ని చూపించవచ్చు, సమాధానాలను సరిచూసుకోండి.",
        videoTitle: "AI వీడియోలను సృష్టించండి",
        videoSubtitle: "Google Veo ని ఉపయోగించి మీ ఊహను అధిక-నాణ్యత సినిమాటిక్ క్లిప్‌లుగా మార్చండి",
        videoPromptLabel: "ప్రాంప్ట్",
        videoModelLabel: "Veo మోడల్",
        videoAspectLabel: "ఆస్పెక్ట్ రేషియో",
        sandboxTitle: "శాండ్‌బాక్స్ సిమ్యులేషన్ మోడ్",
        sandboxDesc: "వీడియో జనరేషన్‌ను అనుకరించండి (API కీ అవసరం లేదు)",
        generateVideoBtn: "వీడియోను సృష్టించు",
        suggest1: "డేటా వెలికితీత కోసం పైథాన్ స్క్రాపర్ స్క్రిప్ట్ రాయండి",
        suggest2: "SQL వర్సెస్ NoSQL డేటాబేస్ తేడాలను సరళంగా వివరించండి",
        suggest3: "స్థానిక సేవల్లో AI వ్యాపార ఆలోచనలను చర్చించండి",
        suggest4: "ప్రాజెక్ట్ గడువు పొడిగింపును కోరుతూ ఒక ప్రొఫెషనల్ ఈమెయిల్ రాయండి"
    }
};

// Map languages to Speech API locale codes
const LANGUAGE_LOCALE_MAP = {
    'en': 'en-US',
    'hi': 'hi-IN',
    'mr': 'mr-IN',
    'es': 'es-ES',
    'fr': 'fr-FR',
    'de': 'de-DE',
    'ar': 'ar-SA',
    'zh': 'zh-CN',
    'ja': 'ja-JP',
    'ru': 'ru-RU',
    'pt': 'pt-PT',
    'bn': 'bn-IN',
    'ta': 'ta-IN',
    'te': 'te-IN'
};

function applyLanguage(lang) {
    const t = translations[lang] || translations.en;
    localStorage.setItem('chat-language', lang);

    // Update Welcome UI text elements
    const welcomeTitleEl = document.getElementById('welcome-title');
    const welcomeSubtitleEl = document.getElementById('welcome-subtitle');
    if (welcomeTitleEl) welcomeTitleEl.innerText = t.welcomeTitle;
    if (welcomeSubtitleEl) welcomeSubtitleEl.innerText = t.welcomeSubtitle;

    // Update Input Textarea Placeholder
    if (chatInput) {
        if (isStreaming) {
            chatInput.placeholder = t.thinking;
        } else {
            chatInput.placeholder = t.typeMessage;
        }
    }

    // Update Disclaimer text
    const disclaimerEl = document.getElementById('disclaimer-text');
    if (disclaimerEl) disclaimerEl.innerText = t.disclaimer;

    // Update Sidebar Navigation button text
    const newChatSpan = document.querySelector('#new-chat-btn span');
    if (newChatSpan) newChatSpan.innerText = t.newChat;

    const chatNavSpan = document.querySelector('#sidebar-nav-chat span');
    if (chatNavSpan) chatNavSpan.innerText = t.chatAssistant;

    const videoNavSpan = document.querySelector('#sidebar-nav-video span');
    if (videoNavSpan) videoNavSpan.innerText = t.videoGenerator;

    const settingsSpan = document.querySelector('#settings-btn span');
    if (settingsSpan) settingsSpan.innerText = t.settings;

    // Update suggestion cards
    const suggestText1 = document.getElementById('suggest-text-1');
    const suggestText2 = document.getElementById('suggest-text-2');
    const suggestText3 = document.getElementById('suggest-text-3');
    const suggestText4 = document.getElementById('suggest-text-4');

    if (suggestText1) {
        suggestText1.innerText = t.suggest1;
        suggestText1.closest('.suggestion-card').setAttribute('data-prompt', t.suggest1);
    }
    if (suggestText2) {
        suggestText2.innerText = t.suggest2;
        suggestText2.closest('.suggestion-card').setAttribute('data-prompt', t.suggest2);
    }
    if (suggestText3) {
        suggestText3.innerText = t.suggest3;
        suggestText3.closest('.suggestion-card').setAttribute('data-prompt', t.suggest3);
    }
    if (suggestText4) {
        suggestText4.innerText = t.suggest4;
        suggestText4.closest('.suggestion-card').setAttribute('data-prompt', t.suggest4);
    }

    // Video generator localizations
    const videoTitle = document.getElementById('video-title');
    const videoSubtitle = document.getElementById('video-subtitle');
    const videoPromptLabel = document.getElementById('video-prompt-label');
    const videoModelLabel = document.getElementById('video-model-label');
    const videoAspectLabel = document.getElementById('video-aspect-label');
    const sandboxTitle = document.getElementById('sandbox-title');
    const sandboxDesc = document.getElementById('sandbox-desc');
    const generateVideoText = document.getElementById('generate-video-text');

    if (videoTitle) videoTitle.innerText = t.videoTitle;
    if (videoSubtitle) videoSubtitle.innerText = t.videoSubtitle;
    if (videoPromptLabel) videoPromptLabel.innerText = t.videoPromptLabel;
    if (videoModelLabel) videoModelLabel.innerText = t.videoModelLabel;
    if (videoAspectLabel) videoAspectLabel.innerText = t.videoAspectLabel;
    if (sandboxTitle) {
        sandboxTitle.innerHTML = `<i class="fa-solid fa-flask"></i> ` + t.sandboxTitle;
    }
    if (sandboxDesc) sandboxDesc.innerText = t.sandboxDesc;
    if (generateVideoText) generateVideoText.innerText = t.generateVideoBtn;
}

// TTS Text-to-Speech implementation
let currentUtterance = null;
let activeSpeakBtn = null;

function toggleSpeakMessage(text, button) {
    if (window.speechSynthesis.speaking && activeSpeakBtn === button) {
        window.speechSynthesis.cancel();
        return;
    }

    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }

    activeSpeakBtn = button;
    
    // Strip markdown to speak plain text
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = marked.parse(text);
    const plainText = tempDiv.innerText || tempDiv.textContent || text;

    const utterance = new SpeechSynthesisUtterance(plainText);
    const activeLang = languageSelect ? languageSelect.value : 'en';
    utterance.lang = LANGUAGE_LOCALE_MAP[activeLang] || 'en-US';
    
    utterance.onstart = () => {
        button.classList.add('speaking');
        button.innerHTML = `<i class="fa-solid fa-stop"></i> <span>Stop</span>`;
    };

    utterance.onend = () => {
        button.classList.remove('speaking');
        button.innerHTML = `<i class="fa-solid fa-volume-high"></i> <span>Speak</span>`;
        if (activeSpeakBtn === button) {
            activeSpeakBtn = null;
            currentUtterance = null;
        }
    };

    utterance.onerror = () => {
        button.classList.remove('speaking');
        button.innerHTML = `<i class="fa-solid fa-volume-high"></i> <span>Speak</span>`;
        if (activeSpeakBtn === button) {
            activeSpeakBtn = null;
            currentUtterance = null;
        }
    };

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
}

window.addEventListener('beforeunload', () => {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
});

// Auth DOM Elements
const headerLoginBtn = document.getElementById('header-login-btn');
const userMenuWrapper = document.getElementById('user-menu-wrapper');
const userAvatarBtn = document.getElementById('user-avatar-btn');
const userDropdownMenu = document.getElementById('user-dropdown-menu');
const dropdownUsername = document.getElementById('dropdown-username');
const dropdownEmail = document.getElementById('dropdown-email');
const logoutBtn = document.getElementById('logout-btn');

const authModal = document.getElementById('auth-modal');
const closeAuthModalBtn = document.getElementById('close-auth-modal-btn');
const tabLoginBtn = document.getElementById('tab-login-btn');
const tabRegisterBtn = document.getElementById('tab-register-btn');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginErrorMsg = document.getElementById('login-error-msg');
const registerErrorMsg = document.getElementById('register-error-msg');

const chatContainer = document.getElementById('chat-container');
const welcomeScreen = document.getElementById('welcome-screen');
const messagesList = document.getElementById('messages-list');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const voiceBtn = document.getElementById('voice-btn');

// Settings Modal Elements
const settingsModal = document.getElementById('settings-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const cancelSettingsBtn = document.getElementById('cancel-settings-btn');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const apiKeyInput = document.getElementById('api-key-input');
const togglePasswordBtn = document.getElementById('toggle-password-btn');
const keyStatusIndicator = document.getElementById('key-status-indicator');

const hfKeyInput = document.getElementById('hf-key-input');
const toggleHfPasswordBtn = document.getElementById('toggle-hf-password-btn');
const hfKeyStatusIndicator = document.getElementById('hf-key-status-indicator');

// Configure Marked.js
const renderer = new marked.Renderer();
renderer.code = function ({ text, lang }) {
    const language = lang || 'text';
    return `
    <div class="code-block-container">
        <div class="code-block-header">
            <span class="code-block-lang">${language}</span>
            <button class="copy-code-btn" onclick="copyCode(this)">
                <i class="fa-regular fa-clipboard"></i> Copy code
            </button>
        </div>
        <pre><code class="language-${language}">${escapeHtml(text)}</code></pre>
    </div>`;
};
marked.setOptions({ renderer: renderer });

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Global function to copy code to clipboard
window.copyCode = function (button) {
    const container = button.closest('.code-block-container');
    const codeElement = container.querySelector('code');
    const textToCopy = codeElement.innerText;

    navigator.clipboard.writeText(textToCopy).then(() => {
        // Change button state visually
        button.innerHTML = `<i class="fa-solid fa-check" style="color: #34a853;"></i> Copied!`;
        button.style.pointerEvents = 'none';

        setTimeout(() => {
            button.innerHTML = `<i class="fa-regular fa-clipboard"></i> Copy code`;
            button.style.pointerEvents = 'auto';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
};

// Event Listeners
document.addEventListener('DOMContentLoaded', initApp);

// Sidebar Toggle
hamburgerBtn.addEventListener('click', () => {
    sidebar.classList.remove('collapsed');
});
closeSidebarBtn.addEventListener('click', () => {
    sidebar.classList.add('collapsed');
});

// Auto-adjust textarea height
chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = (chatInput.scrollHeight - 4) + 'px';

    // Enable/disable send button
    if (chatInput.value.trim().length > 0 && !isStreaming) {
        sendBtn.disabled = false;
    } else {
        sendBtn.disabled = true;
    }
});

// Send on Enter (Shift+Enter for newline)
chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Send button click
sendBtn.addEventListener('click', sendMessage);

// Speech Recognition (Voice Input) implementation
let speechRecognition = null;
let isRecognizing = false;

function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        return null;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => {
        isRecognizing = true;
        voiceBtn.classList.add('recording');
        const lang = languageSelect ? languageSelect.value : 'en';
        const t = translations[lang] || translations.en;
        chatInput.placeholder = lang === 'en' ? 'Listening... Speak now.' : 'सुन रहे हैं... बोलें / Listening...';
    };

    recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        if (text) {
            chatInput.value = (chatInput.value + " " + text).trim();
            chatInput.dispatchEvent(new Event('input'));
        }
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        stopSpeechRecognition();
    };

    recognition.onend = () => {
        stopSpeechRecognition();
    };

    return recognition;
}

function startSpeechRecognition() {
    if (!speechRecognition) {
        speechRecognition = initSpeechRecognition();
    }
    if (!speechRecognition) {
        alert("Speech Recognition API is not supported in this browser. Please try Google Chrome or Microsoft Edge.");
        return;
    }
    
    const activeLang = languageSelect ? languageSelect.value : 'en';
    speechRecognition.lang = LANGUAGE_LOCALE_MAP[activeLang] || 'en-US';
    
    try {
        speechRecognition.start();
    } catch (e) {
        console.error(e);
        stopSpeechRecognition();
    }
}

function stopSpeechRecognition() {
    isRecognizing = false;
    if (voiceBtn) voiceBtn.classList.remove('recording');
    if (chatInput) {
        const activeLang = languageSelect ? languageSelect.value : 'en';
        const t = translations[activeLang] || translations.en;
        chatInput.placeholder = t.typeMessage;
    }
    if (speechRecognition) {
        try {
            speechRecognition.stop();
        } catch (e) {}
    }
}

voiceBtn.addEventListener('click', () => {
    if (isRecognizing) {
        stopSpeechRecognition();
    } else {
        startSpeechRecognition();
    }
});

// New Chat button
newChatBtn.addEventListener('click', startNewSession);

// Settings Modals
settingsBtn.addEventListener('click', openSettingsModal);
headerSettingsBtn.addEventListener('click', openSettingsModal);
cancelSettingsBtn.addEventListener('click', closeSettingsModal);
saveSettingsBtn.addEventListener('click', saveSettings);
closeModalBtn.addEventListener('click', closeSettingsModal);

if (languageSelect) {
    languageSelect.addEventListener('change', (e) => {
        applyLanguage(e.target.value);
    });
}

togglePasswordBtn.addEventListener('click', () => {
    const type = apiKeyInput.getAttribute('type') === 'password' ? 'text' : 'password';
    apiKeyInput.setAttribute('type', type);
    const icon = togglePasswordBtn.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
});

toggleHfPasswordBtn.addEventListener('click', () => {
    const type = hfKeyInput.getAttribute('type') === 'password' ? 'text' : 'password';
    hfKeyInput.setAttribute('type', type);
    const icon = toggleHfPasswordBtn.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
});


// Auth Event Listeners
headerLoginBtn.addEventListener('click', () => openAuthModal());
closeAuthModalBtn.addEventListener('click', () => closeAuthModal());

tabLoginBtn.addEventListener('click', () => switchAuthTab('login'));
tabRegisterBtn.addEventListener('click', () => switchAuthTab('register'));

userAvatarBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    userDropdownMenu.style.display = userDropdownMenu.style.display === 'none' ? 'block' : 'none';
});

document.addEventListener('click', (e) => {
    if (userDropdownMenu && !userMenuWrapper.contains(e.target)) {
        userDropdownMenu.style.display = 'none';
    }
});

logoutBtn.addEventListener('click', async () => {
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
        currentUser = null;
        userDropdownMenu.style.display = 'none';
        renderUserHeader();
        await loadSessions();
        if (sessionsList.length > 0) {
            selectSession(sessionsList[0].id);
        } else {
            currentSessionId = null;
            renderMessages([]);
        }
    } catch (err) {
        console.error('Logout error:', err);
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginErrorMsg.style.display = 'none';
    const username = document.getElementById('auth-username').value.trim();
    const password = document.getElementById('auth-password').value.trim();

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (!res.ok) {
            loginErrorMsg.innerText = data.error || "Login failed.";
            loginErrorMsg.style.display = 'block';
            return;
        }

        currentUser = data.user;
        renderUserHeader();
        closeAuthModal();
        await loadSessions();
        if (sessionsList.length > 0) {
            selectSession(sessionsList[0].id);
        } else {
            startNewSession(true);
        }
    } catch (err) {
        loginErrorMsg.innerText = "Network error while logging in.";
        loginErrorMsg.style.display = 'block';
    }
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    registerErrorMsg.style.display = 'none';
    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value.trim();

    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();
        if (!res.ok) {
            registerErrorMsg.innerText = data.error || "Registration failed.";
            registerErrorMsg.style.display = 'block';
            return;
        }

        currentUser = data.user;
        renderUserHeader();
        closeAuthModal();
        await loadSessions();
        if (sessionsList.length > 0) {
            selectSession(sessionsList[0].id);
        } else {
            startNewSession(true);
        }
    } catch (err) {
        registerErrorMsg.innerText = "Network error while creating account.";
        registerErrorMsg.style.display = 'block';
    }
});

function openAuthModal() {
    authModal.style.display = 'flex';
    switchAuthTab('login');
}

function closeAuthModal() {
    authModal.style.display = 'none';
    loginForm.reset();
    registerForm.reset();
    loginErrorMsg.style.display = 'none';
    registerErrorMsg.style.display = 'none';
}

function switchAuthTab(tab) {
    if (tab === 'login') {
        tabLoginBtn.classList.add('active');
        tabRegisterBtn.classList.remove('active');
        loginForm.style.display = 'flex';
        registerForm.style.display = 'none';
    } else {
        tabRegisterBtn.classList.add('active');
        tabLoginBtn.classList.remove('active');
        registerForm.style.display = 'flex';
        loginForm.style.display = 'none';
    }
}

async function checkCurrentUser() {
    try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
            const data = await res.json();
            currentUser = data.user;
        } else {
            currentUser = null;
        }
    } catch (e) {
        currentUser = null;
    }
    renderUserHeader();
}

function renderUserHeader() {
    if (currentUser) {
        headerLoginBtn.style.display = 'none';
        userMenuWrapper.style.display = 'block';
        const initial = currentUser.username ? currentUser.username[0].toUpperCase() : 'U';
        userAvatarBtn.innerText = initial;
        dropdownUsername.innerText = currentUser.username;
        dropdownEmail.innerText = currentUser.email || 'No email attached';
    } else {
        headerLoginBtn.style.display = 'flex';
        userMenuWrapper.style.display = 'none';
    }
}

// Initialize Application
async function initApp() {
    // Check status
    checkConnectionStatus();
    // Load current user
    await checkCurrentUser();
    // Load Settings
    await checkKeyStatus();
    // Load sessions from DB
    await loadSessions();

    // Select stored language or default to 'en'
    const storedLang = localStorage.getItem('chat-language') || 'en';
    if (languageSelect) {
        languageSelect.value = storedLang;
    }
    applyLanguage(storedLang);

    // Select the first session, or if empty, stay on welcome screen
    if (sessionsList.length > 0) {
        selectSession(sessionsList[0].id);
    } else {
        startNewSession(false); // Create but don't select right away, keep interface clear
    }
}

// Connection Status Monitor
function checkConnectionStatus() {
    // Basic ping status
    if (navigator.onLine) {
        statusDot.className = 'status-dot online';
        statusText.innerText = 'Connected';
    } else {
        statusDot.className = 'status-dot offline';
        statusText.innerText = 'Offline';
    }
}

window.addEventListener('online', checkConnectionStatus);
window.addEventListener('offline', checkConnectionStatus);

// API Key status load
async function checkKeyStatus() {
    try {
        const res = await fetch('/api/settings');
        const data = await res.json();

        if (data.gemini_api_key_configured) {
            keyStatusIndicator.className = 'key-status success';
            keyStatusIndicator.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>API Key configured (${data.masked_key})</span>`;
            apiKeyInput.value = '';
            apiKeyInput.placeholder = '••••••••••••••••••••';
        } else {
            keyStatusIndicator.className = 'key-status warning';
            keyStatusIndicator.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <span>API Key is missing</span>`;
            apiKeyInput.placeholder = 'Enter API Key (AIzaSy...)';
        }

        if (data.hf_api_key_configured) {
            hfKeyStatusIndicator.className = 'key-status success';
            hfKeyStatusIndicator.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>Hugging Face API Key configured (${data.masked_hf_key})</span>`;
            hfKeyInput.value = '';
            hfKeyInput.placeholder = '••••••••••••••••••••';
        } else {
            hfKeyStatusIndicator.className = 'key-status warning';
            hfKeyStatusIndicator.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <span>Hugging Face API Key is missing</span>`;
            hfKeyInput.placeholder = 'Enter Hugging Face Token (hf_...)';
        }
    } catch (err) {
        console.error('Error fetching settings:', err);
    }
}

// Fetch session list from SQLite
async function loadSessions() {
    try {
        const res = await fetch('/api/sessions');
        if (!res.ok) throw new Error('Failed to load sessions');

        sessionsList = await res.json();
        renderSessions();
    } catch (err) {
        console.error('Error loading sessions:', err);
        historyList.innerHTML = `<div class="history-loading" style="color: var(--accent-red);"><i class="fa-solid fa-circle-exclamation"></i> Error loading chats</div>`;
    }
}

// Render sessions in sidebar
function renderSessions() {
    if (sessionsList.length === 0) {
        historyList.innerHTML = `<div class="history-loading" style="font-size: 0.82rem;">No recent chats</div>`;
        return;
    }

    historyList.innerHTML = '';
    sessionsList.forEach(session => {
        const item = document.createElement('div');
        item.className = `history-item ${session.id === currentSessionId ? 'active' : ''}`;
        item.setAttribute('data-id', session.id);

        item.innerHTML = `
            <div class="history-item-left">
                <i class="fa-regular fa-message"></i>
                <span class="history-title" title="${escapeHtml(session.title)}">${escapeHtml(session.title)}</span>
            </div>
            <div class="history-item-actions">
                <button class="history-action-btn delete-btn" title="Delete chat">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </div>
        `;

        // Select session
        item.querySelector('.history-item-left').addEventListener('click', () => {
            if (isStreaming) return;
            selectSession(session.id);
        });

        // Delete session
        item.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            if (isStreaming) return;
            deleteSession(session.id);
        });

        historyList.appendChild(item);
    });
}

// Start a new chat session
async function startNewSession(autoSelect = true) {
    if (isStreaming) return;

    try {
        const res = await fetch('/api/sessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: "New Conversation" })
        });

        const newSession = await res.json();
        await loadSessions();

        if (autoSelect) {
            selectSession(newSession.id);
        }
    } catch (err) {
        console.error('Error creating session:', err);
    }
}

// Select a session and load history
async function selectSession(sessionId) {
    currentSessionId = sessionId;

    // Highlight active session in sidebar
    document.querySelectorAll('.history-item').forEach(item => {
        if (item.getAttribute('data-id') === sessionId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Load messages from SQLite
    try {
        const res = await fetch(`/api/sessions/${sessionId}/messages`);
        if (!res.ok) throw new Error();

        const messages = await res.json();
        renderMessages(messages);
    } catch (err) {
        console.error('Error fetching messages:', err);
    }
}

// Delete session and history
async function deleteSession(sessionId) {
    if (!confirm("Are you sure you want to delete this conversation?")) return;

    try {
        const res = await fetch(`/api/sessions/${sessionId}`, { method: 'DELETE' });
        if (res.ok) {
            await loadSessions();
            if (currentSessionId === sessionId) {
                if (sessionsList.length > 0) {
                    selectSession(sessionsList[0].id);
                } else {
                    currentSessionId = null;
                    renderMessages([]);
                }
            }
        }
    } catch (err) {
        console.error('Error deleting session:', err);
    }
}

// Render message history in chat screen
function renderMessages(messages) {
    if (messages.length === 0) {
        welcomeScreen.style.display = 'flex';
        messagesList.style.display = 'none';
        messagesList.innerHTML = '';
        return;
    }

    welcomeScreen.style.display = 'none';
    messagesList.style.display = 'flex';
    messagesList.innerHTML = '';

    messages.forEach(msg => {
        appendMessageToUI(msg.role, msg.content, false);
    });

    scrollToBottom();
}

// Append message element to Chat window
function appendMessageToUI(role, content, isStreamingMessage = false) {
    const item = document.createElement('div');
    item.className = `message-item ${role === 'user' ? 'user' : 'model'}`;

    const avatarContent = role === 'user' ? 'U' : '<i class="fa-solid fa-wand-magic-sparkles"></i>';
    const senderName = role === 'user' ? 'You' : 'THOREX AI';

    const actionsHtml = role === 'model' && !isStreamingMessage ? `
        <div class="message-actions">
            <button class="message-action-btn speak-msg-btn" title="Read Aloud">
                <i class="fa-solid fa-volume-high"></i> <span>Speak</span>
            </button>
            <button class="message-action-btn create-yt-btn" title="Generate YouTube Video from Response">
                <i class="fa-brands fa-youtube"></i> <span>Create Video</span>
            </button>
        </div>
    ` : '';

    // Create element structure
    item.innerHTML = `
        <div class="message-avatar">${avatarContent}</div>
        <div class="message-content-wrapper">
            <div class="message-sender-name">${senderName}</div>
            <div class="message-content ${isStreamingMessage ? 'streaming-active cursor-blink' : ''}">
                ${role === 'user' ? escapeHtml(content).replace(/\n/g, '<br>') : marked.parse(content)}
            </div>
            ${actionsHtml}
        </div>
    `;

    messagesList.appendChild(item);

    // Run Prism highlighting for code blocks
    if (role === 'model') {
        Prism.highlightAllUnder(item);
        
        // Connect speaker button if it exists
        const speakBtn = item.querySelector('.speak-msg-btn');
        if (speakBtn) {
            speakBtn.addEventListener('click', () => {
                toggleSpeakMessage(content, speakBtn);
            });
        }

        // Connect YouTube Create button if it exists
        const ytBtn = item.querySelector('.create-yt-btn');
        if (ytBtn) {
            ytBtn.addEventListener('click', () => {
                createYouTubeVideoFromMessage(content);
            });
        }
    }

    return item;
}

// Send user message
async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text || isStreaming) return;

    // Ensure we have an active session
    if (!currentSessionId) {
        await startNewSession(true);
    }

    // Clear input box
    chatInput.value = '';
    chatInput.style.height = 'auto';
    sendBtn.disabled = true;

    // Update welcome screen
    welcomeScreen.style.display = 'none';
    messagesList.style.display = 'flex';

    // Append user message to UI
    appendMessageToUI('user', text);
    scrollToBottom();

    // Disable inputs
    isStreaming = true;
    chatInput.placeholder = 'THOREX AI is thinking...';
    chatInput.disabled = true;

    // Create assistant streaming message bubble with loading dots
    const modelItem = document.createElement('div');
    modelItem.className = 'message-item model';
    modelItem.innerHTML = `
        <div class="message-avatar"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
        <div class="message-content-wrapper">
            <div class="message-sender-name">THOREX AI</div>
            <div class="message-content streaming-active cursor-blink">
                <div class="model-loading-indicator">
                    <span></span><span></span><span></span>
                </div>
            </div>
        </div>
    `;
    messagesList.appendChild(modelItem);
    scrollToBottom();

    const contentContainer = modelItem.querySelector('.message-content');

    try {
        const modelSelect = document.getElementById('chat-model-select');
        const selectedModel = modelSelect ? modelSelect.value : 'gemini-2.5-flash';
        const activeLang = languageSelect ? languageSelect.value : 'en';

        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session_id: currentSessionId,
                message: text,
                model: selectedModel,
                language: activeLang
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let accumulatedResponse = '';
        let isFirstText = true;
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            // Process Server Sent Events formatting
            const lines = buffer.split('\n');
            // Keep last partial line in buffer
            buffer = lines.pop();

            for (const line of lines) {
                const cleanedLine = line.trim();
                if (!cleanedLine.startsWith('data:')) continue;

                try {
                    const data = JSON.parse(cleanedLine.substring(5).trim());

                    // Handle dynamic title generation update
                    if (data.type === 'title') {
                        // Find current session and update title
                        const session = sessionsList.find(s => s.id === currentSessionId);
                        if (session) {
                            session.title = data.title;
                            renderSessions();
                        }
                    }

                    // Handle streaming text chunks
                    if (data.type === 'content') {
                        if (isFirstText) {
                            // Clear loading dots
                            contentContainer.innerHTML = '';
                            isFirstText = false;
                        }
                        accumulatedResponse += data.content;
                        contentContainer.innerHTML = marked.parse(accumulatedResponse);
                        Prism.highlightAllUnder(contentContainer);
                        scrollToBottom();
                    }

                    // Handle completion signals
                    if (data.type === 'done') {
                        // Load sessions to ensure correct state and title
                        await loadSessions();
                    }

                    // Handle server errors
                    if (data.error) {
                        contentContainer.innerHTML = `<span style="color: var(--accent-red);"><i class="fa-solid fa-triangle-exclamation"></i> Error: ${data.error}</span>`;
                        scrollToBottom();
                    }
                } catch (e) {
                    // JSON parsing error or standard heartbeat message
                }
            }
        }

        // Remove blink cursor
        contentContainer.classList.remove('streaming-active', 'cursor-blink');

        // Append Speak and YouTube Create action buttons when done
        const wrapper = contentContainer.closest('.message-content-wrapper');
        if (wrapper) {
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'message-actions';
            actionsDiv.innerHTML = `
                <button class="message-action-btn speak-msg-btn" title="Read Aloud">
                    <i class="fa-solid fa-volume-high"></i> <span>Speak</span>
                </button>
                <button class="message-action-btn create-yt-btn" title="Generate YouTube Video from Response">
                    <i class="fa-brands fa-youtube"></i> <span>Create Video</span>
                </button>
            `;
            wrapper.appendChild(actionsDiv);
            const speakBtn = actionsDiv.querySelector('.speak-msg-btn');
            if (speakBtn) {
                speakBtn.addEventListener('click', () => {
                    toggleSpeakMessage(accumulatedResponse, speakBtn);
                });
            }
            const ytBtn = actionsDiv.querySelector('.create-yt-btn');
            if (ytBtn) {
                ytBtn.addEventListener('click', () => {
                    createYouTubeVideoFromMessage(accumulatedResponse);
                });
            }
        }

    } catch (err) {
        console.error('Streaming error:', err);
        contentContainer.innerHTML = `<span style="color: var(--accent-red);"><i class="fa-solid fa-triangle-exclamation"></i> Communication error. Please check backend connection.</span>`;
        contentContainer.classList.remove('streaming-active', 'cursor-blink');
    } finally {
        isStreaming = false;
        chatInput.placeholder = 'Type a message to THOREX AI...';
        chatInput.disabled = false;
        chatInput.focus();
        // Trigger resize check
        chatInput.dispatchEvent(new Event('input'));
    }
}

// Helpers
function scrollToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Settings modal handles
function openSettingsModal() {
    settingsModal.style.display = 'flex';
    checkKeyStatus();
}

function closeSettingsModal() {
    settingsModal.style.display = 'none';
    apiKeyInput.value = '';
    hfKeyInput.value = '';
}

async function saveSettings() {
    const key = apiKeyInput.value.trim();
    const hfKey = hfKeyInput.value.trim();
    
    const payload = {};
    if (key) payload.gemini_api_key = key;
    if (hfKey) payload.hf_api_key = hfKey;

    if (Object.keys(payload).length === 0) {
        closeSettingsModal();
        return;
    }

    try {
        const res = await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert("Settings saved successfully.");
            closeSettingsModal();
            await checkKeyStatus();
        } else {
            alert("Failed to save settings.");
        }
    } catch (err) {
        console.error('Error saving settings:', err);
        alert("Error connecting to server.");
    }
}

// ==========================================
// VIDEO GENERATOR WORKFLOW IMPLEMENTATION
// ==========================================

// Navigation switcher elements
const navChatBtn = document.getElementById('sidebar-nav-chat');
const navVideoBtn = document.getElementById('sidebar-nav-video');
const chatContainerEl = document.getElementById('chat-container');
const chatInputAreaEl = document.getElementById('chat-input-area');
const videoContainerEl = document.getElementById('video-container');

// Video elements
const videoPromptInput = document.getElementById('video-prompt-input');
const videoModelSelect = document.getElementById('video-model-select');
const videoAspectSelect = document.getElementById('video-aspect-select');
const sandboxModeToggle = document.getElementById('sandbox-mode-toggle');
const generateVideoBtn = document.getElementById('generate-video-btn');

const previewPlaceholder = document.getElementById('preview-placeholder');
const progressBox = document.getElementById('generation-progress-box');
const generatedVideoBox = document.getElementById('generated-video-box');
const previewVideoPlayer = document.getElementById('preview-video-player');
const downloadVideoBtn = document.getElementById('download-video-btn');

const progressBarFill = document.getElementById('progress-bar-fill');
const progressStatusTitle = document.getElementById('progress-status-title');
const progressStatusDesc = document.getElementById('progress-status-desc');
const progressTimeElapsed = document.getElementById('progress-time-elapsed');
const galleryGrid = document.getElementById('gallery-grid');

let activePollingInterval = null;
let currentGenerationId = null;
let currentGenerationStartTime = null;

// Tab switcher listeners
if (navChatBtn && navVideoBtn) {
    navChatBtn.addEventListener('click', () => {
        if (isStreaming || activePollingInterval) {
            alert("Please wait for the current stream or generation to complete.");
            return;
        }
        navChatBtn.classList.add('active');
        navVideoBtn.classList.remove('active');
        chatContainerEl.style.display = 'flex';
        chatInputAreaEl.style.display = 'block';
        videoContainerEl.style.display = 'none';
        
        // Re-adjust input height
        chatInput.dispatchEvent(new Event('input'));
    });

    navVideoBtn.addEventListener('click', () => {
        if (isStreaming || activePollingInterval) {
            alert("Please wait for the current stream or generation to complete.");
            return;
        }
        navVideoBtn.classList.add('active');
        navChatBtn.classList.remove('active');
        chatContainerEl.style.display = 'none';
        chatInputAreaEl.style.display = 'none';
        videoContainerEl.style.display = 'flex';
        
        // Load gallery history
        loadVideoGallery();
    });
}

// Generate Video action
if (generateVideoBtn) {
    generateVideoBtn.addEventListener('click', startVideoGeneration);
}

async function startVideoGeneration() {
    const prompt = videoPromptInput.value.trim();
    const model = videoModelSelect.value;
    const aspect = videoAspectSelect.value;
    const sandbox = sandboxModeToggle.checked;

    if (!prompt) {
        alert("Please enter a text prompt to generate video.");
        videoPromptInput.focus();
        return;
    }

    // Reset previews
    previewPlaceholder.style.display = 'none';
    generatedVideoBox.style.display = 'none';
    progressBox.style.display = 'flex';
    progressBarFill.style.width = '5%';
    progressStatusTitle.innerText = "Submitting prompt...";
    progressStatusDesc.innerText = sandbox ? "Initializing Sandbox simulation..." : "Connecting to Google AI Studio...";
    progressTimeElapsed.innerText = "Elapsed: 0s";

    generateVideoBtn.disabled = true;
    generateVideoBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Generating...`;

    currentGenerationStartTime = Date.now();

    try {
        const res = await fetch('/api/video/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: prompt,
                model: model,
                aspect_ratio: aspect,
                sandbox: sandbox
            })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "Failed to start video generation.");
        }

        currentGenerationId = data.id;
        
        // Start polling status
        startStatusPolling();

    } catch (err) {
        console.error("Video generation failed to start:", err);
        progressBox.style.display = 'none';
        previewPlaceholder.style.display = 'flex';
        generateVideoBtn.disabled = false;
        generateVideoBtn.innerHTML = `<i class="fa-solid fa-play"></i> <span>Generate Video</span>`;
        alert(err.message || "An error occurred starting the generation.");
    }
}

function startStatusPolling() {
    if (activePollingInterval) clearInterval(activePollingInterval);

    activePollingInterval = setInterval(async () => {
        const elapsedSeconds = Math.floor((Date.now() - currentGenerationStartTime) / 1000);
        progressTimeElapsed.innerText = `Elapsed: ${elapsedSeconds}s`;

        try {
            const res = await fetch(`/api/video/status/${currentGenerationId}`);
            if (!res.ok) {
                throw new Error("Polling error");
            }
            
            const data = await res.json();

            if (data.status === "pending") {
                progressBarFill.style.width = `${data.progress || 10}%`;
                progressStatusTitle.innerText = "Queued...";
                progressStatusDesc.innerText = "Waiting in Google AI Studio task queue";
            } 
            else if (data.status === "generating") {
                progressBarFill.style.width = `${data.progress || 40}%`;
                progressStatusTitle.innerText = "Generating Video...";
                progressStatusDesc.innerText = data.sandbox ? "Synthesizing frames in Sandbox mode" : "Google Veo model is drawing video files";
            } 
            else if (data.status === "completed") {
                // Done!
                clearInterval(activePollingInterval);
                activePollingInterval = null;
                
                const isImage = data.video_path && (data.video_path.endsWith('.png') || data.video_path.endsWith('.jpg') || data.video_path.endsWith('.jpeg') || data.video_path.endsWith('.webp'));
                
                progressBarFill.style.width = "100%";
                progressStatusTitle.innerText = "Generation completed!";
                progressStatusDesc.innerText = isImage ? "Image ready to view & download." : "Video ready to play & download.";

                setTimeout(() => {
                    progressBox.style.display = 'none';
                    generatedVideoBox.style.display = 'flex';
                    
                    const videoPlayer = document.getElementById('preview-video-player');
                    const imagePlayer = document.getElementById('preview-image-player');
                    const ext = isImage ? 'png' : 'mp4';
                    
                    if (isImage) {
                        if (videoPlayer) videoPlayer.style.display = 'none';
                        if (imagePlayer) {
                            imagePlayer.src = data.video_path;
                            imagePlayer.style.display = 'block';
                        }
                    } else {
                        if (imagePlayer) imagePlayer.style.display = 'none';
                        if (videoPlayer) {
                            videoPlayer.style.display = 'block';
                            videoPlayer.src = data.video_path;
                            videoPlayer.load();
                            videoPlayer.play().catch(e => console.log("Auto-play blocked or failed:", e));
                        }
                    }
                    
                    downloadVideoBtn.href = data.video_path;
                    downloadVideoBtn.download = `${currentGenerationId}.${ext}`;

                    // Save to local storage history
                    saveVideoToLocalHistory({
                        id: currentGenerationId,
                        prompt: videoPromptInput.value.trim(),
                        model: videoModelSelect.value,
                        aspect_ratio: videoAspectSelect.value,
                        video_path: data.video_path,
                        created_at: new Date().toLocaleString(),
                        sandbox: data.sandbox
                    });

                    // Reset button
                    generateVideoBtn.disabled = false;
                    generateVideoBtn.innerHTML = `<i class="fa-solid fa-play"></i> <span>Generate Video</span>`;
                }, 800);
            } 
            else if (data.status === "failed") {
                throw new Error(data.error_message || "Video generation failed.");
            }

        } catch (err) {
            clearInterval(activePollingInterval);
            activePollingInterval = null;
            progressBox.style.display = 'none';
            previewPlaceholder.style.display = 'flex';
            generateVideoBtn.disabled = false;
            generateVideoBtn.innerHTML = `<i class="fa-solid fa-play"></i> <span>Generate Video</span>`;
            alert(err.message || "An error occurred during video generation. Please check API credentials or quotas.");
        }
    }, 2000);
}

// LocalStorage History Helpers
function saveVideoToLocalHistory(videoItem) {
    let list = [];
    try {
        const stored = localStorage.getItem('thorex_generated_videos');
        if (stored) {
            list = JSON.parse(stored);
        }
    } catch (e) {
        list = [];
    }
    
    list.unshift(videoItem); // Add to beginning
    localStorage.setItem('thorex_generated_videos', JSON.stringify(list));
    
    // Refresh Gallery
    loadVideoGallery();
}

function loadVideoGallery() {
    if (!galleryGrid) return;
    
    let list = [];
    try {
        const stored = localStorage.getItem('thorex_generated_videos');
        if (stored) {
            list = JSON.parse(stored);
        }
    } catch (e) {
        list = [];
    }

    if (list.length === 0) {
        galleryGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted); font-size: 0.88rem;">
                <i class="fa-regular fa-folder-open" style="font-size: 2rem; margin-bottom: 12px; display: block; opacity: 0.5;"></i>
                No videos generated yet. Enter a prompt to get started!
            </div>
        `;
        return;
    }

    galleryGrid.innerHTML = '';
    list.forEach(video => {
        const card = document.createElement('div');
        card.className = 'gallery-card';
        
        // Clean display variables
        const cleanPrompt = escapeHtml(video.prompt);
        const dateStr = video.created_at || 'Recently';
        const displayModel = video.model ? video.model.replace('-preview', '') : 'Veo';
        const isSandbox = video.sandbox ? '<span class="gallery-tag" style="background-color: rgba(160, 124, 248, 0.2); color: #a07cf8;">Sandbox</span>' : '<span class="gallery-tag">Live API</span>';

        const isImage = video.video_path && (video.video_path.endsWith('.png') || video.video_path.endsWith('.jpg') || video.video_path.endsWith('.jpeg') || video.video_path.endsWith('.webp'));
        const mediaHtml = isImage 
            ? `<img src="${video.video_path}" style="width: 100%; height: 100%; object-fit: cover;" alt="${cleanPrompt}" />`
            : `<video src="${video.video_path}" muted loop playsinline></video>`;
        const playOverlayHtml = isImage 
            ? '' 
            : `<div class="gallery-play-overlay"><i class="fa-solid fa-play"></i></div>`;
        const downloadTitle = isImage ? 'Download image' : 'Download video';
        const deleteTitle = isImage ? 'Delete image' : 'Delete video';

        card.innerHTML = `
            <div class="gallery-media-wrapper">
                ${mediaHtml}
                ${playOverlayHtml}
            </div>
            <div class="gallery-info">
                <p class="gallery-prompt" title="${cleanPrompt}">${cleanPrompt}</p>
                <div class="gallery-meta">
                    <span>${dateStr}</span>
                    <div class="gallery-actions">
                        ${isSandbox}
                        <button class="gallery-btn-icon download" title="${downloadTitle}">
                            <i class="fa-solid fa-arrow-down-to-bracket"></i>
                        </button>
                        <button class="gallery-btn-icon delete" title="${deleteTitle}">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Event listener for Hover play/pause (Videos only)
        if (!isImage) {
            const videoEl = card.querySelector('video');
            const playOverlay = card.querySelector('.gallery-play-overlay');
            
            card.querySelector('.gallery-media-wrapper').addEventListener('mouseenter', () => {
                if (videoEl) videoEl.play().catch(e => {});
                if (playOverlay) playOverlay.style.opacity = '0';
            });

            card.querySelector('.gallery-media-wrapper').addEventListener('mouseleave', () => {
                if (videoEl) videoEl.pause();
                if (playOverlay) playOverlay.style.opacity = '1';
            });
        }

        // Click to load into active player
        card.querySelector('.gallery-media-wrapper').addEventListener('click', () => {
            previewPlaceholder.style.display = 'none';
            progressBox.style.display = 'none';
            generatedVideoBox.style.display = 'flex';
            
            const videoPlayer = document.getElementById('preview-video-player');
            const imagePlayer = document.getElementById('preview-image-player');
            const ext = isImage ? 'png' : 'mp4';
            
            if (isImage) {
                if (videoPlayer) videoPlayer.style.display = 'none';
                if (imagePlayer) {
                    imagePlayer.src = video.video_path;
                    imagePlayer.style.display = 'block';
                }
            } else {
                if (imagePlayer) imagePlayer.style.display = 'none';
                if (videoPlayer) {
                    videoPlayer.style.display = 'block';
                    videoPlayer.src = video.video_path;
                    videoPlayer.load();
                    videoPlayer.play().catch(e => {});
                }
            }
            
            downloadVideoBtn.href = video.video_path;
            downloadVideoBtn.download = `${video.id}.${ext}`;
            
            // Scroll to preview video area
            document.querySelector('.video-preview-card').scrollIntoView({ behavior: 'smooth' });
        });

        // Download action button
        card.querySelector('.gallery-btn-icon.download').addEventListener('click', (e) => {
            e.stopPropagation();
            const a = document.createElement('a');
            a.href = video.video_path;
            const ext = isImage ? 'png' : 'mp4';
            a.download = `${video.id}.${ext}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });

        // Delete action button
        card.querySelector('.gallery-btn-icon.delete').addEventListener('click', async (e) => {
            e.stopPropagation();
            const mediaType = isImage ? "image" : "video";
            if (!confirm(`Are you sure you want to delete this generated ${mediaType}?`)) return;
            
            try {
                // Inform backend to clean up video file
                await fetch(`/api/video/delete/${video.id}`, { method: 'DELETE' });
            } catch (err) {
                console.error("Backend delete failed:", err);
            }
            
            // Remove from local storage list
            removeVideoFromLocalHistory(video.id);
        });

        galleryGrid.appendChild(card);
    });
}

function removeVideoFromLocalHistory(id) {
    let list = [];
    try {
        const stored = localStorage.getItem('thorex_generated_videos');
        if (stored) {
            list = JSON.parse(stored);
        }
    } catch (e) {
        list = [];
    }
    
    list = list.filter(v => v.id !== id);
    localStorage.setItem('thorex_generated_videos', JSON.stringify(list));
    
    // Refresh Gallery
    loadVideoGallery();
}
