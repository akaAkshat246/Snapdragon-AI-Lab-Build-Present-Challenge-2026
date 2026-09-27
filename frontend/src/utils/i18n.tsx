import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTheme, type Theme } from './theme';

export { useTheme, type Theme };
export type Language = 'English' | 'Hindi' | 'Telugu';

export interface Translations {
  // Brand & Header
  brandTitle: string;
  brandSubtitle: string;
  clinicianLogin: string;
  themeLight: string;
  themeDark: string;
  textSize: string;

  // Hero
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroCtaLogin: string;
  heroCtaArch: string;

  // Key Metrics
  subCentres: string;
  subCentresNote: string;
  phcs: string;
  phcsNote: string;
  chcs: string;
  chcsNote: string;
  totalFacilities: string;
  totalFacilitiesNote: string;
  validatedSens: string;
  validatedSensNote: string;
  offlineInference: string;
  offlineInferenceNote: string;

  // 7-Stage Architecture Section
  archSectionTitle: string;
  archSectionSubtitle: string;
  archRuleNote: string;
  stepWord: string;
  inputWord: string;
  outputWord: string;
  safetyRuleWord: string;
  stages: {
    title: string;
    module: string;
    input: string;
    output: string;
    failSafe: string;
  }[];

  // 7 Pillars Section
  pillarsTitle: string;
  pillarsSubtitle: string;
  pillars: {
    title: string;
    desc: string;
    tag: string;
  }[];

  // Footer Links & Titles
  footerMissionTitle: string;
  footerMissionSubtitle: string;
  footerMissionDesc: string;
  footerTelemetry: string;
  footerToolsTitle: string;
  footerGovernanceTitle: string;
  footerSupportTitle: string;
  footerSupportText: string;
  footerSystemArch: string;
  footerCopyright: string;
  footerSecurity: string;
  footerGPS: string;
  footerVersion: string;
}

export const translations: Record<Language, Translations> = {
  English: {
    brandTitle: 'Rural-XDR • Retinal Screening & Tele-Ophthalmology',
    brandSubtitle: 'Explainable, Offline & Human-in-the-Loop AI Framework for Rural India',
    clinicianLogin: 'Clinician Login',
    themeLight: 'Light Mode',
    themeDark: 'Dark Mode',
    textSize: 'Text Size:',

    heroTitle: 'Rural-XDR: Explainable, Offline & Human-in-the-Loop AI System',
    heroSubtitle: 'Diabetic Retinopathy Screening & Tele-Ophthalmology in Rural India',
    heroDescription: 'An integrated edge-AI framework combining automated image-quality gating, 5-grade DR severity classification, Grad-CAM attention heatmaps, bilingual counseling and 30/60/90-day referral completion tracking.',
    heroCtaLogin: 'Launch Clinical Portal',
    heroCtaArch: '7-Stage AI Architecture',

    subCentres: 'Sub-centres (Ayushman Arogya)',
    subCentresNote: 'Village Frontline Clinics (NHM MIS)',
    phcs: 'Primary Health Centres (PHCs)',
    phcsNote: 'First-Contact Medical Clinics',
    chcs: 'Community Health Centres (CHCs)',
    chcsNote: 'Block Referral Hubs',
    totalFacilities: 'Total Public Health Facilities',
    totalFacilitiesNote: 'Nationwide Network (NHM 2024)',
    validatedSens: 'Validated Sensitivity (BMJ Open)',
    validatedSensNote: 'Referable DR (Chauhan 2026)',
    offlineInference: 'Target Offline Inference',
    offlineInferenceNote: 'Zero-Cloud Field Deployment',

    archSectionTitle: 'Proposed 7-Stage End-to-End Rural-XDR AI Architecture',
    archSectionSubtitle: 'The design strictly avoids automatic reassurance when image quality or prediction confidence is insufficient. High-risk, uncertain, or ungradable cases are routed to safe secondary specialist review.',
    archRuleNote: 'Safety Core: Never reassure ambiguous predictions. If Image Quality < 0.70 OR Confidence < 0.80 OR P(referable) > 0.50, trigger safe human-in-the-loop referral.',
    stepWord: 'Stage',
    inputWord: 'Input',
    outputWord: 'Output',
    safetyRuleWord: 'Safety Rule',
    stages: [
      {
        title: 'Patient Registration & Consent',
        module: 'Bilingual Field Registration',
        input: 'Patient demographic data, known diabetes duration, informed bilingual consent',
        output: 'Unique Study ID / Health ID (ABHA linked)',
        failSafe: 'Informed consent in local language; de-identified local record creation',
      },
      {
        title: 'Retinal Fundus Image Capture',
        module: 'Smartphone Attachment / Portable Non-Mydriatic Camera',
        input: 'Both-eye posterior pole fundus photographs',
        output: 'Encrypted raw JPEG/PNG image pair',
        failSafe: 'Zero-cloud dependence; image stored on encrypted local device storage',
      },
      {
        title: 'Automated Image-Quality Gate',
        module: 'MobileNetV3 Lightweight Quality Classifier',
        input: 'Retinal image tensor (224x224)',
        output: 'Quality Score Q (0.0 to 1.0) & Failure Cause (Blur, Cataract, Pupil, Field)',
        failSafe: 'If Q < 0.70: Contextual retake guidance. After 3 failed retakes: Direct cataract / ophthalmic referral',
      },
      {
        title: 'Offline DR Severity Grading',
        module: 'EfficientNet-B0/B3 Deep Convolutional Classifier',
        input: 'Gradable retinal image tensor',
        output: '5-Class DR Probabilities (No DR, Mild, Moderate, Severe, PDR) + Referable DR flag',
        failSafe: 'Derives clinical urgency category (Green, Yellow, Orange, Red) rather than binary output',
      },
      {
        title: 'Lesion-Aware Explainability (XAI)',
        module: 'Grad-CAM Attention + U-Net Lesion Segmentation',
        input: 'Feature maps from final conv layers & pixel-level annotations',
        output: 'Grad-CAM Saliency Heatmap + Microaneurysm, Hemorrhage, Hard Exudate masks',
        failSafe: 'Labeled as "AI-highlighted region consistent with possible lesion" to maintain clinical safety',
      },
      {
        title: 'Uncertainty-Aware Triage Engine',
        module: 'Monte Carlo Dropout / Calibrated Entropy Gate',
        input: 'Quality Score Q, Severity Class, Prediction Confidence C',
        output: 'Triage Recommendation (Low Risk vs Specialist Review vs Urgent Laser Referral)',
        failSafe: 'Escalate if Q < 0.70 OR C < 0.80 OR P(referable DR) > 0.50. Never reassure uncertain predictions',
      },
      {
        title: 'Bilingual Counselling & 30/60/90-Day Referral',
        module: 'Bilingual Decision Support & Follow-up Tracker',
        input: 'Risk level, local language (Hindi/English), barrier assessment',
        output: 'Bilingual patient printed report, SMS reminder trigger, ASHA follow-up log',
        failSafe: 'Track barrier reasons (Cost, Distance, Caregiver, Fear, Delay) at 30, 60, and 90 days',
      },
    ],

    pillarsTitle: 'The 7 Core Implementation Pillars of Rural-XDR',
    pillarsSubtitle: 'A complete, end-to-end framework solving real-world clinical, diagnostic, and follow-up barriers in rural screening.',
    pillars: [
      {
        title: '1. Offline-First Edge AI',
        desc: '100% offline neural network inference on laptops/smartphones in zero-connectivity village camps.',
        tag: 'MobileNetV3 / EfficientNet',
      },
      {
        title: '2. Automated Quality Gating',
        desc: 'Evaluates blur, cataracts, pupil glare, and field-of-view before grading with localized retake prompts.',
        tag: '4-Class Quality Classifier',
      },
      {
        title: '3. 5-Grade DR Severity',
        desc: 'Classifies No DR, Mild, Moderate, Severe, and Proliferative DR paired with a 4-tier clinical urgency rating.',
        tag: 'International Severity Scale',
      },
      {
        title: '4. Lesion-Aware Grad-CAM XAI',
        desc: 'Provides transparent anatomical attention heatmaps and microaneurysm, hemorrhage, and hard exudate overlays.',
        tag: 'Grad-CAM & U-Net Segmentation',
      },
      {
        title: '5. Uncertainty-Aware Escalation',
        desc: 'Avoids automated reassurance on ambiguous or low-confidence scans; routes directly to ophthalmologists.',
        tag: 'Calibrated Entropy & MC Dropout',
      },
      {
        title: '6. Bilingual Patient Counseling',
        desc: 'Generates color-coded, plain-language patient slips in Hindi and English with pictorial lifestyle advice.',
        tag: 'Hindi & English Decision Slips',
      },
      {
        title: '7. 30/60/90-Day Referral Tracking',
        desc: 'Bridges the drop-off gap by logging follow-up visits, transport barriers, and ASHA worker outreach.',
        tag: 'ASHA Linkage & SMS Alerts',
      },
    ],

    footerMissionTitle: 'DR-XAI Clinical Intelligence',
    footerMissionSubtitle: 'Retinal Screening & Tele-Ophthalmology',
    footerMissionDesc: 'An explainable AI-powered retinal assessment and tele-consultation platform designed for rural clinics, mobile screening camps, and primary care centers to detect diabetic retinopathy early and streamline secondary eye care referrals.',
    footerTelemetry: 'GPS-Tagged Field Telemetry & Geotagged Clinical Records',
    footerToolsTitle: 'Clinical Intelligence & Tools',
    footerGovernanceTitle: 'Clinical Governance & Security',
    footerSupportTitle: 'Clinical Support Network',
    footerSupportText: '24/7 technical and clinical support for field health workers and ophthalmology consult nodes.',
    footerSystemArch: 'System Architecture: DR-XAI Distributed Clinical Suite v2.4',
    footerCopyright: '© 2026 DR-XAI Clinical Healthcare Platform. All rights reserved.',
    footerSecurity: 'Security Status: Encrypted & Validated',
    footerGPS: 'GPS Telemetry: Active',
    footerVersion: 'Version: v2.4.2 Clinical Production',
  },

  Hindi: {
    brandTitle: 'रूरल-एक्सडीआर • रेटिना जांच एवं टेली-ऑप्थल्मोलॉजी',
    brandSubtitle: 'ग्रामीण भारत हेतु व्याख्या योग्य, ऑफलाइन एवं सुरक्षित एआई फ्रेमवर्क',
    clinicianLogin: 'चिकित्सक लॉगिन',
    themeLight: 'लाइट मोड',
    themeDark: 'डार्क मोड',
    textSize: 'फ़ॉन्ट आकार:',

    heroTitle: 'रूरल-एक्सडीआर: व्याख्या योग्य, ऑफलाइन एवं ह्यूमन-इन-द-लूप एआई प्रणाली',
    heroSubtitle: 'ग्रामीण भारत में डायबिटिक रेटिनोपैथी जांच एवं नेत्र विशेषज्ञ टेली-परामर्श',
    heroDescription: 'स्वचालित छवि गुणवत्ता जांच, 5-स्तरीय डीआर वर्गीकरण, ग्रैड-सीएएम हीटमैप, द्विभाषी परामर्श और 30/60/90-दिवसीय रेफरल ट्रैकिंग को संयोजित करने वाला संपूर्ण एआई समाधान।',
    heroCtaLogin: 'क्लिनिकल पोर्टल खोलें',
    heroCtaArch: '7-चरणीय एआई संरचना देखें',

    subCentres: 'उप-स्वास्थ्य केंद्र (आयुष्मान आरोग्य मंदिर)',
    subCentresNote: 'ग्रामीण प्राथमिक स्वास्थ्य इकाइयां (NHM MIS)',
    phcs: 'प्राथमिक स्वास्थ्य केंद्र (PHCs)',
    phcsNote: 'प्रथम-संपर्क चिकित्सा केंद्र',
    chcs: 'सामुदायिक स्वास्थ्य केंद्र (CHCs)',
    chcsNote: 'प्रखंड स्तरीय रेफरल अस्पताल',
    totalFacilities: 'कुल सार्वजनिक स्वास्थ्य संस्थान',
    totalFacilitiesNote: 'अखिल भारतीय नेटवर्क (NHM 2024)',
    validatedSens: 'प्रमाणित संवेदनशीलता (BMJ Open)',
    validatedSensNote: 'रेफ़रेबल डीआर (चौहान 2026)',
    offlineInference: 'ऑफ़लाइन एआई निष्पादन',
    offlineInferenceNote: 'शून्य-इंटरनेट ग्रामीण शिविर क्षमता',

    archSectionTitle: 'प्रस्तावित 7-चरणीय संपूर्ण रूरल-एक्सडीआर एआई संरचना',
    archSectionSubtitle: 'यह प्रणाली छवि गुणवत्ता या विश्वास कम होने पर कभी भी झूठा आश्वासन नहीं देती। संदिग्ध मामलों को सुरक्षित रूप से नेत्र विशेषज्ञ के पास भेजा जाता है।',
    archRuleNote: 'सुरक्षा नियम: अस्पष्ट भविष्यवाणियों पर रोगी को आश्वस्त न करें। गुणवत्ता < 0.70 या विश्वास < 0.80 होने पर तुरंत विशेषज्ञ परामर्श दें।',
    stepWord: 'चरण',
    inputWord: 'इनपुट',
    outputWord: 'आउटपुट',
    safetyRuleWord: 'सुरक्षा नियम',
    stages: [
      {
        title: 'रोगी पंजीकरण एवं सहमति',
        module: 'द्विभाषी फील्ड पंजीकरण',
        input: 'जनसांख्यिकीय डेटा, मधुमेह की अवधि, स्थानीय भाषा में सूचित सहमति',
        output: 'विशिष्ट अध्ययन आईडी / आभा (ABHA) स्वास्थ्य आईडी',
        failSafe: 'स्थानीय भाषा में पूर्ण सहमति; स्थानीय सुरक्षित एन्क्रिप्टेड रिकॉर्ड निर्माण',
      },
      {
        title: 'रेटिना फंडस फोटोग्राफी',
        module: 'पोर्टेबल नॉन-माइड्रिएटिक कैमरा / स्मार्टफोन लेंस',
        input: 'दोनों आंखों के फंडस फोटो',
        output: 'एन्क्रिप्टेड उच्च-रिज़ॉल्यूशन जेपीईजी/पीएनजी छवियां',
        failSafe: 'शून्य-क्लाउड निर्भरता; डिवाइस के भीतर ही सुरक्षित स्थानीय भंडारण',
      },
      {
        title: 'स्वचालित छवि-गुणवत्ता सत्यापन',
        module: 'MobileNetV3 गुणवत्ता क्लासिफायर',
        input: 'रेटिना छवि टेंसर (224x224)',
        output: 'गुणवत्ता स्कोर Q (0.0 से 1.0) एवं विफलता का कारण (धुंधलापन, मोतियाबिंद)',
        failSafe: 'यदि Q < 0.70: तत्काल पुनः फोटो लेने का सुझाव; 3 असफल प्रयासों पर मोतियाबिंद रेफरल',
      },
      {
        title: 'ऑफलाइन डीआर गंभीरता ग्रेडिंग',
        module: 'EfficientNet डीप कन्वोल्यूशनल क्लासिफायर',
        input: 'सत्यापित श्रेणीबद्ध रेटिना छवि',
        output: '5-स्तरीय डीआर संभावनाएं (कोई डीआर नहीं, हल्का, मध्यम, गंभीर, प्रोलिफेरेटिव)',
        failSafe: 'रंग-कोडित नैदानिक तात्कालिकता (हरा, पीला, नारंगी, लाल) प्रदान करता है',
      },
      {
        title: 'घाव-सचेत ग्रैड-सीएएम व्याख्या (XAI)',
        module: 'Grad-CAM अटेंशन + U-Net लीजन सेगमेंटेशन',
        input: 'अंतिम कन्वोल्यूशनल लेयर्स के फीचर मैप्स',
        output: 'ग्रैड-सीएएम हीटमैप + माइक्रोएन्यूरिज्म, रक्तस्राव एवं हार्ड एक्स्युडेट ओवरले',
        failSafe: '"एआई-चिह्नित संभावित घाव क्षेत्र" के रूप में लेबल किया गया सुरक्षित निर्णय समर्थन',
      },
      {
        title: 'अनिश्चितता-जागरूक ट्राइएज इंजन',
        module: 'मोंटे कार्लो ड्रॉपआउट / कैलिब्रेटेड एंट्रॉपी गेट',
        input: 'गुणवत्ता स्कोर Q, गंभीरता स्तर, मॉडल विश्वास C',
        output: 'ट्राइएज अनुशंसा (कम जोखिम बनाम विशेषज्ञ समीक्षा बनाम तत्काल लेजर रेफरल)',
        failSafe: 'यदि Q < 0.70 या C < 0.80 तो तुरंत उच्च अस्पताल रेफरल; सुरक्षित प्रोटोकॉल',
      },
      {
        title: 'द्विभाषी परामर्श एवं 30/60/90-दिवसीय फॉलो-अप',
        module: 'द्विभाषी निर्णय समर्थन एवं आशा (ASHA) ट्रैकर',
        input: 'जोखिम स्तर, स्थानीय भाषा (हिंदी/अंग्रेजी), संभावित बाधाएं',
        output: 'मुद्रित रोगी पर्ची, एसएमएस चेतावनी, आशा कार्यकर्ता फॉलो-अप सूची',
        failSafe: '30, 60 और 90 दिनों पर दूरी, व्यय और भय की बाधाओं का सक्रिय समाधान',
      },
    ],

    pillarsTitle: 'रूरल-एक्सडीआर के 7 मुख्य कार्यान्वयन स्तंभ',
    pillarsSubtitle: 'ग्रामीण नेत्र जांच में आने वाली तकनीकी, नैदानिक एवं फॉलो-अप समस्याओं का संपूर्ण समाधान।',
    pillars: [
      {
        title: '1. ऑफलाइन-फर्स्ट एज एआई',
        desc: 'शून्य इंटरनेट वाले सुदूर ग्रामीण शिविरों में लैपटॉप या स्मार्टफोन पर 100% ऑफ़लाइन एआई जांच।',
        tag: 'MobileNetV3 / EfficientNet',
      },
      {
        title: '2. स्वचालित गुणवत्ता सत्यापन',
        desc: 'ग्रेडिंग से पहले मोतियाबिंद, धुंधलेपन एवं पुतली की रोशनी की जांच व पुनः फोटो सुझाव।',
        tag: '4-श्रेणी गुणवत्ता क्लासिफायर',
      },
      {
        title: '3. 5-स्तरीय डीआर गंभीरता',
        desc: 'अंतरराष्ट्रीय मानकों के अनुसार 5 गंभीरता स्तर एवं 4-रंगीन तात्कालिकता रेटिंग।',
        tag: 'अंतरराष्ट्रीय गंभीरता पैमाना',
      },
      {
        title: '4. लीजन-सचेत ग्रैड-सीएएम हीटमैप',
        desc: 'रेटिना के क्षतिग्रस्त हिस्सों को पारदर्शी रंगीन हीटमैप द्वारा विजुअल रूप में प्रदर्शित करना।',
        tag: 'Grad-CAM और U-Net',
      },
      {
        title: '5. अनिश्चितता-जागरूक एस्केलेशन',
        desc: 'संदिग्ध या कम विश्वास वाले स्कैन पर कभी गलत आश्वासन न देकर सीधे विशेषज्ञ को भेजना।',
        tag: 'कैलिब्रेटेड एंट्रॉपी गेट',
      },
      {
        title: '6. द्विभाषी रोगी परामर्श',
        desc: 'हिंदी और अंग्रेजी में सरल, रंग-कोडित रिपोर्ट और सचित्र जीवनशैली परामर्श पर्ची।',
        tag: 'हिंदी एवं अंग्रेजी पर्ची',
      },
      {
        title: '7. 30/60/90-दिवसीय रेफरल ट्रैकिंग',
        desc: 'आशा कार्यकर्ताओं के सहयोग से रेफरल पूरा करने की निगरानी व रोगी की दृष्टि रक्षा।',
        tag: 'आशा लिंकेज व एसएमएस अलर्ट',
      },
    ],

    footerMissionTitle: 'डीआर-एक्सएआई क्लिनिकल इंटेलिजेंस',
    footerMissionSubtitle: 'रेटिना जांच एवं टेली-ऑप्थल्मोलॉजी',
    footerMissionDesc: 'ग्रामीण क्लीनिकों, मोबाइल स्क्रीनिंग शिविरों और प्राथमिक स्वास्थ्य केंद्रों के लिए डिजाइन किया गया व्याख्या योग्य एआई रेटिना मूल्यांकन और टेली-परामर्श मंच।',
    footerTelemetry: 'जीपीएस-टैग युक्त फील्ड टेलीमेट्री एवं नैदानिक रिकॉर्ड्स',
    footerToolsTitle: 'क्लिनिकल इंटेलिजेंस एवं टूल्स',
    footerGovernanceTitle: 'क्लिनिकल गवर्नेंस एवं सुरक्षा',
    footerSupportTitle: '24x7 क्लिनिकल सहायता नेटवर्क',
    footerSupportText: 'फील्ड स्वास्थ्य कार्यकर्ताओं एवं नेत्र रोग नोड्स के लिए 24/7 तकनीकी और क्लिनिकल सहायता।',
    footerSystemArch: 'सिस्टम संरचना: डीआर-एक्सएआई डिस्ट्रीब्यूटेड सुइट v2.4',
    footerCopyright: '© 2026 डीआर-एक्सएआई क्लिनिकल हेल्थकेयर प्लेटफॉर्म। सर्वाधिकार सुरक्षित।',
    footerSecurity: 'सुरक्षा स्थिति: एन्क्रिप्टेड एवं सत्यापित',
    footerGPS: 'जीपीएस टेलीमेट्री: सक्रिय',
    footerVersion: 'संस्करण: v2.4.2 क्लिनिकल प्रोडक्शन',
  },

  Telugu: {
    brandTitle: 'రూరల్-ఎక్స్‌డిఆర్ • రెటీనా స్క్రీనింగ్ & టెలి-ఆప్తాల్మాలజీ',
    brandSubtitle: 'గ్రామీణ భారతదేశం కొరకు సురక్షిత మరియు ఆఫ్‌లైన్ AI వేదిక',
    clinicianLogin: 'వైద్యుల లాగిన్',
    themeLight: 'లైట్ మోడ్',
    themeDark: 'డార్క్ మోడ్',
    textSize: 'ఫాంట్ సైజు:',

    heroTitle: 'రూరల్-ఎక్స్‌డిఆర్: వివరణాత్మక, ఆఫ్‌లైన్ & సురక్షిత AI వ్యవస్థ',
    heroSubtitle: 'డయాబెటిక్ రెటినోపతి స్క్రీనింగ్ మరియు స్పెషలిస్ట్ టెలి-కన్సల్టేషన్',
    heroDescription: 'నాణ్యతా తనిఖీ, 5-స్థాయి తీవ్రత వర్గీకరణ, గ్రాడ్-కామ్ హీట్‌మ్యాప్‌లు మరియు 30/60/90 రోజుల రిఫరల్ ట్రాకింగ్ తో కూడిన సమగ్ర AI వేదిక.',
    heroCtaLogin: 'క్లినికల్ పోర్టల్ ప్రారంభించండి',
    heroCtaArch: '7-దశల AI ఆర్కిటెక్చర్',

    subCentres: 'ఉప-కేంద్రాలు (ఆయుష్మాన్ ఆరోగ్య)',
    subCentresNote: 'గ్రామ ప్రాథమిక ఆరోగ్య కేంద్రాలు',
    phcs: 'ప్రాథమిక ఆరోగ్య కేంద్రాలు (PHCs)',
    phcsNote: 'మొదటి సంప్రదింపు కేంద్రాలు',
    chcs: 'కమ్యూనిటీ హెల్త్ సెంటర్లు (CHCs)',
    chcsNote: 'బ్లాక్ స్థాయి రిఫరల్ ఆసుపత్రులు',
    totalFacilities: 'మొత్తం పబ్లిక్ హెల్త్ సెంటర్లు',
    totalFacilitiesNote: 'దేశవ్యాప్త నెట్‌వర్క్ (NHM 2024)',
    validatedSens: 'ధృవీకరించబడిన సెన్సిటివిటీ',
    validatedSensNote: 'BMJ ఓపెన్ క్లినికల్ ఫలితాలు',
    offlineInference: 'ఆఫ్‌లైన్ AI నిర్ధారణ',
    offlineInferenceNote: 'ఇంటర్నెట్ లేని గ్రామీణ క్యాంపుల కొరకు',

    archSectionTitle: 'ప్రతిపాదిత 7-దశల ఎండ్-టు-ఎండ్ AI ఆర్కిటెక్చర్',
    archSectionSubtitle: 'ఇమేజ్ నాణ్యత లేదా నమ్మకం సరిపోనప్పుడు స్వయంచాలక తప్పుడు భరోసా ఇవ్వకుండా నేరుగా నిపుణులకు పంపుతుంది.',
    archRuleNote: 'భద్రతా సూత్రం: నాణ్యత లేదా నమ్మకం తక్కువగా ఉంటే తక్షణమే స్పెషలిస్ట్ సమీక్షకు పంపండి.',
    stepWord: 'దశ',
    inputWord: 'ఇన్‌పుట్',
    outputWord: 'అవుట్‌పుట్',
    safetyRuleWord: 'భద్రతా నియమం',
    stages: [
      {
        title: 'రోగి నమోదు & సమ్మతి',
        module: 'ద్విభాషా ఫీల్డ్ రిజిస్ట్రేషన్',
        input: 'రోగి వివరాలు, డయాబెటిస్ వ్యవధి, సమ్మతి పత్రం',
        output: 'ప్రత్యేక అధ్యయన ID / ఆభా (ABHA) హెల్త్ ID',
        failSafe: 'స్థానిక భాషలో స్పష్టమైన సమ్మతి నమోదు',
      },
      {
        title: 'రెటీనా ఫోటో క్యాప్చర్',
        module: 'పోర్టబుల్ నాన్-మిడ్రియాటిక్ కెమెరా',
        input: 'రెండు కళ్ళ రెటీనా ఫోటోలు',
        output: 'ఎన్‌క్రిప్ట్ చేయబడిన చిత్రాలు',
        failSafe: 'డివైజ్ లోనే ఆఫ్‌లైన్ సురక్షిత నిల్వ',
      },
      {
        title: 'ఇమేజ్ నాణ్యత తనిఖీ',
        module: 'MobileNetV3 క్వాలిటీ గేట్',
        input: 'రెటీనా ఇమేజ్ టెన్సర్ (224x224)',
        output: 'నాణ్యత స్కోరు Q (0.0 నుండి 1.0)',
        failSafe: 'నాణ్యత లోపిస్తే తిరిగి ఫోటో తీయడానికి సలహా',
      },
      {
        title: 'ఆఫ్‌లైన్ DR గ్రేడింగ్',
        module: 'EfficientNet కన్వోల్యూషనల్ క్లాసిఫైయర్',
        input: 'స్పష్టమైన రెటీనా చిత్రం',
        output: '5-స్థాయి డయాబెటిక్ రెటినోపతి సంభావ్యత',
        failSafe: 'రంగుల కోడింగ్ ఆధారిత అత్యవసర వర్గీకరణ',
      },
      {
        title: 'గ్రాడ్-కామ్ (Grad-CAM) వివరణ',
        module: 'Grad-CAM + U-Net సెగ్మెంటేషన్',
        input: 'డీప్ లెర్నింగ్ ఫీచర్ మ్యాప్స్',
        output: 'కంటి లోపాలను చూపించే విజువల్ హీట్‌మ్యాప్',
        failSafe: 'AI హైలైట్ చేసిన ప్రాంతాల సురక్షిత వివరణ',
      },
      {
        title: 'ట్రయాజ్ ఇంజిన్',
        module: 'క్యాలిబ్రేటెడ్ ఎంట్రోపీ గేట్',
        input: 'నాణ్యత స్కోరు, తీవ్రత, నమ్మకం స్థాయి',
        output: 'చికిత్సా మార్గదర్శకత్వం & రిఫరల్ సిఫార్సు',
        failSafe: 'సందేహాస్పద కేసులను తక్షణమే నిపుణులకు పంపుతుంది',
      },
      {
        title: 'ద్విభాషా కౌన్సెలింగ్ & ఫాలో-అప్',
        module: 'ఆశా (ASHA) లింకేజ్ ట్రాకర్',
        input: 'రిస్క్ స్థాయి, స్థానిక భాష (తెలుగు/ఇంగ్లీష్)',
        output: 'ముద్రించిన రోగి స్లిప్, SMS హెచ్చరికలు',
        failSafe: '30, 60, 90 రోజుల ఫాలో-అప్ ట్రాకింగ్',
      },
    ],

    pillarsTitle: 'రూరల్-ఎక్స్‌డిఆర్ యొక్క 7 ముఖ్య స్తంభాలు',
    pillarsSubtitle: 'గ్రామీణ ప్రాంతాలలో కంటి చూపు రక్షణకు సమగ్ర పరిష్కారం.',
    pillars: [
      {
        title: '1. ఆఫ్‌లైన్ ఎడ్జ్ AI',
        desc: 'ఇంటర్నెట్ లేని గ్రామీణ ప్రాంతాలలో ల్యాప్‌టాప్‌లు మరియు స్మార్ట్‌ఫోన్‌లలో ఆఫ్‌లైన్ నిర్ధారణ.',
        tag: 'MobileNetV3 / EfficientNet',
      },
      {
        title: '2. స్వయంచాలక నాణ్యతా గేట్',
        desc: 'మసకబారడం, శుక్లాలు మరియు కాంతి లోపాలను గుర్తించి నాణ్యమైన ఫోటోలు పొందడం.',
        tag: 'క్వాలిటీ క్లాసిఫైయర్',
      },
      {
        title: '3. 5-స్థాయి DR తీవ్రత',
        desc: 'అంతర్జాతీయ ప్రమాణాల ప్రకారం 5 స్థాయిలలో ఖచ్చితమైన విభజన.',
        tag: 'తీవ్రత స్కేల్',
      },
      {
        title: '4. గ్రాడ్-కామ్ హీట్‌మ్యాప్‌లు',
        desc: 'కంటిలో ఏర్పడిన లోపాలను రంగుల చిత్రాలలో స్పష్టంగా చూపడం.',
        tag: 'Grad-CAM XAI',
      },
      {
        title: '5. సురక్షిత ఎస్కేలేషన్',
        desc: 'సందేహం ఉన్న స్కాన్‌లను నేరుగా కంటి నిపుణుల వద్దకు పంపడం.',
        tag: 'ఎంట్రోపీ గేట్',
      },
      {
        title: '6. ద్విభాషా రోగి స్లిప్స్',
        desc: 'రోగులకు సులభంగా అర్థమయ్యే భాషలో రంగుల నివేదికలు అందించడం.',
        tag: 'తెలుగు & ఇంగ్లీష్ స్లిప్స్',
      },
      {
        title: '7. 30/60/90 రోజుల రిఫరల్ ట్రాకింగ్',
        desc: 'ఆశా కార్యకర్తల సహకారంతో రోగులు ఆసుపత్రికి వెళ్లేలా పర్యవేక్షించడం.',
        tag: 'ఆశా లింకేజ్',
      },
    ],

    footerMissionTitle: 'DR-XAI క్లినికల్ ఇంటెలిజెన్స్',
    footerMissionSubtitle: 'రెటీనా స్క్రీనింగ్ & టెలి-ఆప్తాల్మాలజీ',
    footerMissionDesc: 'గ్రామీణ క్లినిక్‌లు మరియు మొబైల్ క్యాంపుల కొరకు రూపొందించబడిన AI రెటీనా మూల్యాంకన వేదిక.',
    footerTelemetry: 'GPS-ట్యాగ్ చేయబడిన ఫీల్డ్ టెలిమెట్రీ రికార్డులు',
    footerToolsTitle: 'క్లినికల్ సాధనాలు',
    footerGovernanceTitle: 'గవర్నెన్స్ & భద్రత',
    footerSupportTitle: '24x7 క్లినికల్ సపోర్ట్',
    footerSupportText: 'ఫీల్డ్ హెల్త్ వర్కర్ల కొరకు నిరంతర సాంకేతిక మరియు క్లినికల్ సహాయం.',
    footerSystemArch: 'సిస్టమ్ ఆర్కిటెక్చర్: DR-XAI క్లినికల్ సూట్ v2.4',
    footerCopyright: '© 2026 DR-XAI క్లినికల్ హెల్త్‌కేర్ వేదిక. సర్వహక్కులు ప్రత్యేకించబడ్డాయి.',
    footerSecurity: 'భద్రతా స్థితి: ఎన్‌క్రిప్ట్ & ధృవీకరించబడింది',
    footerGPS: 'GPS టెలిమెట్రీ: క్రియాశీలం',
    footerVersion: 'వెర్షన్: v2.4.2 క్లినికల్ ప్రొడక్షన్',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  fontSize: 'sm' | 'md' | 'lg';
  setFontSize: (size: 'sm' | 'md' | 'lg') => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (val: boolean) => void;
  toggleSidebar: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, setTheme, toggleTheme, isDark } = useTheme();

  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('app_lang');
      if (saved === 'Hindi' || saved === 'Telugu') return saved;
    } catch {}
    return 'English';
  });

  const [fontSize, setFontSizeState] = useState<'sm' | 'md' | 'lg'>(() => {
    try {
      return (localStorage.getItem('app_font_size') as 'sm' | 'md' | 'lg') || 'md';
    } catch {
      return 'md';
    }
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('app_lang', lang);
    } catch {}
  };

  const applySizing = (size: 'sm' | 'md' | 'lg') => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.remove('font-sm', 'font-md', 'font-lg');
    root.classList.add(`font-${size}`);

    if (size === 'sm') {
      (root.style as any).zoom = '0.90';
      root.style.fontSize = '14px';
    } else if (size === 'lg') {
      (root.style as any).zoom = '1.16';
      root.style.fontSize = '18.5px';
    } else {
      (root.style as any).zoom = '1.0';
      root.style.fontSize = '16px';
    }
  };

  const setFontSize = (size: 'sm' | 'md' | 'lg') => {
    setFontSizeState(size);
    try {
      localStorage.setItem('app_font_size', size);
    } catch {}
    applySizing(size);
  };

  // Initial font sizing application
  useEffect(() => {
    applySizing(fontSize);
  }, [fontSize]);

  const t = translations[language] || translations.English;

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        fontSize,
        setFontSize,
        theme,
        setTheme,
        toggleTheme,
        isDark,
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebar,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
};
