import drillIncidentCommand from '../assets/images/drill_incident_command_1791743716844.jpg';
import drillFireSuppression from '../assets/images/drill_fire_suppression_1791743727605.jpg';
import drillCasualtyCare from '../assets/images/drill_casualty_care_1791743736853.jpg';
import drillEvacuationSupport from '../assets/images/drill_evacuation_support_1791743746771.jpg';
import drillExternalLiaison from '../assets/images/drill_external_liaison_1791743756763.jpg';

// Scenario-specific realistic drill photographs (All 25 Scenarios - 100% relevant!)
// Team Leader (101 - 105)
import imgCommandDoorsSmoke from '../assets/images/command_doors_smoke_1791745902616.jpg'; // TL-1
import imgTrashcanFireOut from '../assets/images/trashcan_fire_out_1791745914562.jpg'; // TL-2
import imgChemicalSpillLobby from '../assets/images/chemical_spill_lobby_1791744593273.jpg'; // TL-3
import imgCrackedPillarTremor from '../assets/images/cracked_pillar_tremor_1791744575742.jpg'; // TL-4
import imgKitchenFireSafe from '../assets/images/kitchen_fire_safe_1791745926163.jpg'; // TL-5

// Fire Suppression (201 - 205)
import imgServerRackSmoke from '../assets/images/server_rack_smoke_1791744536500.jpg'; // FS-1
import imgFlashoverSmokeDoor from '../assets/images/flashover_smoke_door_1791745716793.jpg'; // FS-2
import imgGasCylinderFlames from '../assets/images/gas_cylinder_flames_1791744564756.jpg'; // FS-3
import imgElectricalPanelLockout from '../assets/images/electrical_panel_lockout_1791745732210.jpg'; // FS-4
import imgScbaLowAir from '../assets/images/scba_low_air_1791745746641.jpg'; // FS-5

// Casualty Care (301 - 305)
import imgTourniquetLegHallway from '../assets/images/drill_casualty_care_1791743736853.jpg'; // CC-1
import imgUnconsciousSmokyRoom from '../assets/images/unconscious_smoky_room_1791744526780.jpg'; // CC-2
import imgChemSmokeTent from '../assets/images/chem_smoke_tent_1791745692756.jpg'; // CC-3
import imgAedCardiacBreakroom from '../assets/images/aed_cardiac_breakroom_1791744555777.jpg'; // CC-4
import imgAcidSplashShower from '../assets/images/acid_splash_shower_1791745705004.jpg'; // CC-5

// Evacuation Support (401 - 405)
import imgStairwellChairClear from '../assets/images/stairwell_chair_clear_1791745939263.jpg'; // ES-1
import imgHotStairDoor from '../assets/images/hot_stair_door_1791744546017.jpg'; // ES-2
import imgEvacuationDoorCrowd from '../assets/images/evacuation_door_crowd_1791745953292.jpg'; // ES-3
import imgSmokePlumeAssembly from '../assets/images/smoke_plume_assembly_1791744585142.jpg'; // ES-4
import imgDarkHallwayGlow from '../assets/images/dark_hallway_glow_1791745758182.jpg'; // ES-5

// Liaison (501 - 505)
import imgFiretruckGateArrival from '../assets/images/firetruck_gate_arrival_1791745986556.jpg'; // LN-1
import imgToxicGasGate from '../assets/images/toxic_gas_gate_1791745769820.jpg'; // LN-2
import imgCrowdBlockingAmbulance from '../assets/images/crowd_blocking_ambulance_1791745782680.jpg'; // LN-3
import imgIncidentCommandHandover from '../assets/images/incident_command_handover_1791745997853.jpg'; // LN-4
import imgTwoWayRadioDrill from '../assets/images/two_way_radio_drill_1791746010854.jpg'; // LN-5

export interface Role {
  id: string;
  title: { en: string; ar: string };
  context: { en: string; ar: string };
  iconType: string;
  drillImage: string;
}

export interface ScenarioFeedback {
  correct: string;
  incorrect: string;
  steps: string[];
}

export interface Scenario {
  id: number;
  roleId: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  correctDecision: 'FIGHT' | 'FLEE';
  drillImage?: string;
  feedback: {
    en: ScenarioFeedback;
    ar: ScenarioFeedback;
  };
}

export interface DataMatrix {
  roles: Role[];
  scenarios: Scenario[];
}

export const DATA_MATRIX: DataMatrix = {
  roles: [
    {
      id: "team_leader",
      title: { en: "Team Leader", ar: "قائد الفريق" },
      context: { en: "Emergency Coordinator - KSIA Offices", ar: "منسق الطوارئ - مكاتب مطار الملك سلمان" },
      iconType: "shield",
      drillImage: drillIncidentCommand
    },
    {
      id: "fire_suppression",
      title: { en: "Fire Suppression", ar: "إطفاء الحرائق" },
      context: { en: "First Response & Fire Control", ar: "الاستجابة الأولية ومكافحة الحرائق" },
      iconType: "flame",
      drillImage: drillFireSuppression
    },
    {
      id: "casualty_care",
      title: { en: "Casualty Care", ar: "رعاية المصابين" },
      context: { en: "First Aid & Medical Help", ar: "الإسعافات الأولية والدعم الطبي" },
      iconType: "cross",
      drillImage: drillCasualtyCare
    },
    {
      id: "evacuation_support",
      title: { en: "Evacuation Support", ar: "دعم الإخلاء" },
      context: { en: "Guiding People & Safe Exit Routes", ar: "توجيه الأشخاص ومسارات الخروج الآمنة" },
      iconType: "door",
      drillImage: drillEvacuationSupport
    },
    {
      id: "liaison",
      title: { en: "External Liaison", ar: "مسؤول الاتصال الخارجي" },
      context: { en: "Civil Defense & Ambulance Contact", ar: "التواصل مع الدفاع المدني والهلال الأحمر" },
      iconType: "radio",
      drillImage: drillExternalLiaison
    }
  ],
  scenarios: [
    // ---------------- TEAM LEADER (101 - 105) ----------------
    {
      id: 101,
      roleId: "team_leader",
      title: { en: "TL-1: Smoke Entering the Command Room", ar: "ق1: دخول الدخان إلى غرفة القيادة" },
      description: {
        en: "Light smoke is entering your 2nd-floor command room through the air vents. Your radios are working well.",
        ar: "بدأ دخان خفيف يدخل غرفة القيادة في الدور الثاني عبر فتحات التكييف. أجهزة اللاسلكي تعمل بشكل ممتاز."
      },
      correctDecision: "FLEE",
      drillImage: imgCommandDoorsSmoke,
      feedback: {
        en: {
          correct: "CORRECT! Never stay in a command room that has smoke or dangerous air. Move immediately.",
          incorrect: "INCORRECT. Staying in a room with smoke puts the leader in danger and stops operations.",
          steps: [
            "1. Move the command team to the safe outdoor ground area right away.",
            "2. Tell all teams on the radio that you are moving the command post.",
            "3. Continue directing the team from the safe open area."
          ]
        },
        ar: {
          correct: "صحيح! لا تبق أبداً في غرفة قيادة يدخلها الدخان. تحرك فوراً إلى مكان آمن.",
          incorrect: "غير صحيح. البقاء في غرفة بها دخان يعرض القائد للخطر ويوقف إدارة الحادث.",
          steps: [
            "1. نقل فريق القيادة فوراً إلى منطقة التجمع الأرضية الآمنة في الخارج.",
            "2. إبلاغ جميع الفرق عبر اللاسلكي بنقل موقع القيادة.",
            "3. مواصلة توجيه الفرق من المنطقة الآمنة المفتوحة."
          ]
        }
      }
    },
    {
      id: 102,
      roleId: "team_leader",
      title: { en: "TL-2: Small Trash Can Fire Under Control", ar: "ق2: حريق سلة مهملات صغير وتحت السيطرة" },
      description: {
        en: "A small trash can caught fire on Floor 3. The fire team is already putting it out, and the floor is completely empty.",
        ar: "اشتعلت سلة مهملات صغيرة بالدور الثالث. فريق الإطفاء يتعامل معها الآن، والدور تم إخلاؤه بالكامل."
      },
      correctDecision: "FIGHT",
      drillImage: imgTrashcanFireOut,
      feedback: {
        en: {
          correct: "CORRECT! The fire is very small, your team has it under control, and your command post is safe.",
          incorrect: "INCORRECT. Leaving your post during a controlled minor incident creates unnecessary panic.",
          steps: [
            "1. Stay in contact with the fire team leader by radio.",
            "2. Confirm that Floor 3 is completely clear of people.",
            "3. Prepare to give an update to incoming Civil Defense teams."
          ]
        },
        ar: {
          correct: "صحيح! الحريق بسيط جداً وفريقك يسيطر عليه وغرفة القيادة آمنة تماماً.",
          incorrect: "غير صحيح. ترك القيادة في حادث بسيط وتحت السيطرة يسبب الفوضى بدون مبرر.",
          steps: [
            "1. الحفاظ على التواصل اللاسلكي مع مسؤول الإطفاء.",
            "2. التأكد من خلو الدور الثالث من جميع الموظفين.",
            "3. الاستعداد لتزويد الدفاع المدني بالتقرير فور وصولهم."
          ]
        }
      }
    },
    {
      id: 103,
      roleId: "team_leader",
      title: { en: "TL-3: Strong Chemical Fumes in the Lobby", ar: "ق3: روائح كيميائية قوية في البهو" },
      description: {
        en: "A container of strong cleaning chemical broke in the main lobby. Dangerous fumes are spreading toward your room.",
        ar: "انكسرت حاوية منظفات كيميائية قوية في البهو الرئيسي. وتنتشر روائح خطرة باتجاه غرفتكم."
      },
      correctDecision: "FLEE",
      drillImage: imgChemicalSpillLobby,
      feedback: {
        en: {
          correct: "CORRECT! Strong chemical fumes can poison your team. Move outdoors away from the wind immediately.",
          incorrect: "INCORRECT. Breathing toxic fumes can knock out the leadership team.",
          steps: [
            "1. Move the command post outdoors to a safe area away from the wind.",
            "2. Warn the medical team to keep people away from the lobby.",
            "3. Ask Civil Defense for specialized hazardous chemical support."
          ]
        },
        ar: {
          correct: "صحيح! الأبخرة الكيميائية قد تسبب تسمم الفريق. تحرك للخارج عكس اتجاه الرياح فوراً.",
          incorrect: "غير صحيح. استنشاق الأبخرة السامة قد يفقد قيادة الطوارئ وعيها.",
          steps: [
            "1. نقل مركز القيادة إلى منطقة خارجية آمنة عكس اتجاه الرياح.",
            "2. تحذير المسعفين والشاغلين بالابتعاد تماماً عن البهو.",
            "3. طلب مساندة المواد الخطرة من الدفاع المدني."
          ]
        }
      }
    },
    {
      id: 104,
      roleId: "team_leader",
      title: { en: "TL-4: Cracked Pillars and Creaking Noises", ar: "ق4: تصدع الأعمدة وأصوات تشقق" },
      description: {
        en: "A small tremor shook the building. Big cracks appeared on support pillars near your room, and you hear loud creaking.",
        ar: "حدثت هزة أرضية خفيفة. ظهرت شروخ كبيرة بأعمدة المبنى بالقرب منكم مع سماع أصوات تشقق مستمرة."
      },
      correctDecision: "FLEE",
      drillImage: imgCrackedPillarTremor,
      feedback: {
        en: {
          correct: "CORRECT! Loud creaking and cracked support pillars mean the building could collapse. Evacuate now.",
          incorrect: "INCORRECT. Staying in a damaged building puts lives at risk of sudden collapse.",
          steps: [
            "1. Order everyone in the building to get outside right now.",
            "2. Evacuate all command staff to the safe outdoor open area.",
            "3. Take roll call outside to make sure everyone is safe."
          ]
        },
        ar: {
          correct: "صحيح! أصوات التشقق والشروخ تعني خطر الانهيار المفاجئ. أخلِ المبنى فوراً.",
          incorrect: "غير صحيح. البقاء في مبنى متصدع يعرض حياة الجميع لخطر الانهيار.",
          steps: [
            "1. إصدار أمر فوري لجميع من بالمبنى بالخروج للخارج.",
            "2. خروج فريق القيادة فوراً للساحة الخارجية الآمنة.",
            "3. حصر حضور جميع الموظفين في الخارج للتأكد من سلامتهم."
          ]
        }
      }
    },
    {
      id: 105,
      roleId: "team_leader",
      title: { en: "TL-5: Fire Already Out but Help is Delayed", ar: "ق5: الحريق انتهى ولكن الدعم تأخر" },
      description: {
        en: "Civil Defense is delayed by 15 minutes in traffic. However, your team has already put out the breakroom fire completely.",
        ar: "تأخر الدفاع المدني 15 دقيقة بسبب الزحام. لكن فريقكم قام بإطفاء حريق الاستراحة بالكامل."
      },
      correctDecision: "FIGHT",
      drillImage: imgKitchenFireSafe,
      feedback: {
        en: {
          correct: "CORRECT! The danger is gone. Keep your team in position, monitor the scene, and remain calm.",
          incorrect: "INCORRECT. Leaving your post when the danger is already handled causes unnecessary confusion.",
          steps: [
            "1. Stay at your command post and make sure the fire does not restart.",
            "2. Update Civil Defense by phone that the fire is extinguished.",
            "3. Write down what happened in the official logbook."
          ]
        },
        ar: {
          correct: "صحيح! الخطر زال تماماً. حافظ على موقعك وتابع المكان وابق هادئاً.",
          incorrect: "غير صحيح. الهروب من الموقع بعد السيطرة على الخطر يسبب ارتباكاً دون داعٍ.",
          steps: [
            "1. البقاء في موقع القيادة ومراقبة المكان لعدم اشتعال النار مجدداً.",
            "2. إبلاغ الدفاع المدني هاتفياً بأن الحريق تم إخماده بالكامل.",
            "3. تسجيل وتوثيق ما حدث في سجل الحوادث الرسمي."
          ]
        }
      }
    },

    // ---------------- FIRE SUPPRESSION (201 - 205) ----------------
    {
      id: 201,
      roleId: "fire_suppression",
      title: { en: "FS-1: Small Smoke from Computer Rack", ar: "إ1: دخان خفيف من خزانة الخوادم" },
      description: {
        en: "White smoke is coming from a power battery rack in the server room. You have a CO2 fire extinguisher and the exit door is right behind you.",
        ar: "يتصاعد دخان أبيض من بطاريات الطاقة بغرفة الخوادم. معك طفاية CO2 وباب الخروج مفتوح خلفك مباشرة."
      },
      correctDecision: "FIGHT",
      drillImage: imgServerRackSmoke,
      feedback: {
        en: {
          correct: "CORRECT! The fire is small, you have the right extinguisher, and your escape path is wide open.",
          incorrect: "INCORRECT. Running away from a tiny fire lets it grow into a huge building disaster.",
          steps: [
            "1. Keep the open exit door directly behind your back.",
            "2. Aim the extinguisher at the bottom of the fire and spray.",
            "3. If black smoke starts or the heat gets too high, get out immediately."
          ]
        },
        ar: {
          correct: "صحيح! الحريق في بدايته ومعك الطفاية المناسبة وباب الخروج مفتوح خلفك.",
          incorrect: "غير صحيح. الهروب من حريق صغير في بدايته يجعله يكبر ليصبح كارثة.",
          steps: [
            "1. اجعل باب الخروج المفتوح خلف ظهرك مباشرة.",
            "2. وجّه الطفاية إلى قاعدة اللهب وقم بالرش.",
            "3. إذا اشتد الدخان أو زادت الحرارة، انسحب فوراً للخارج."
          ]
        }
      }
    },
    {
      id: 202,
      roleId: "fire_suppression",
      title: { en: "FS-2: Thick Black Smoke and Extreme Heat", ar: "إ2: دخان أسود كثيف وحرارة شديدة" },
      description: {
        en: "Opening the storage room door reveals boiling black smoke rolling across the ceiling and burning heat hitting your face.",
        ar: "عند فتح باب المستودع، وجدت دخاناً أسود شديد السخونة يتدفق بالسقف مع حرارة حارقة تصيب وجهك."
      },
      correctDecision: "FLEE",
      drillImage: imgFlashoverSmokeDoor,
      feedback: {
        en: {
          correct: "CORRECT! Superhot black smoke on the ceiling means a room explosion of fire is about to happen. Back away!",
          incorrect: "INCORRECT. Entering a room this hot can cause deadly burns in seconds.",
          steps: [
            "1. Close the door right away to cut off fresh air to the fire.",
            "2. Report the extreme heat to the Team Leader.",
            "3. Wait outside safely for the Civil Defense fire trucks."
          ]
        },
        ar: {
          correct: "صحيح! الدخان الأسود الحار جداً في السقف يعني انفجار حريق مفاجئ. تراجع فوراً!",
          incorrect: "غير صحيح. دخول غرفة بهذه الحرارة يسبب حروقاً مميتة خلال ثوانٍ.",
          steps: [
            "1. أغلق الباب فوراً لمنع دخول الهواء النقي للحريق.",
            "2. أبلغ قائد الفريق فوراً بالحرارة الشديدة بالداخل.",
            "3. انتظر بالخارج بأمان وصول فرق الدفاع المدني."
          ]
        }
      }
    },
    {
      id: 203,
      roleId: "fire_suppression",
      title: { en: "FS-3: Gas Tanks Whistling in the Fire", ar: "إ3: صفير حاد من أسطوانات الغاز" },
      description: {
        en: "In the workshop, flames are touching gas cylinders. A loud, high-pitched whistle is screaming from the safety valve.",
        ar: "في ورشة الصيانة، النار تلامس أسطوانات الغاز. يُسمع صوت صفير حاد وعالٍ جداً من صمام الأمان."
      },
      correctDecision: "FLEE",
      drillImage: imgGasCylinderFlames,
      feedback: {
        en: {
          correct: "CORRECT! High whistling from heated gas tanks means the tank will burst and explode. Run to safety!",
          incorrect: "INCORRECT. Going near a whistling gas cylinder in a fire will cause blast injuries.",
          steps: [
            "1. Yell 'GAS TANK EXPLOSION RISK - RUN!' to everyone nearby.",
            "2. Take cover behind a solid wall at least 100 meters away.",
            "3. Inform Civil Defense that pressurized gas tanks are involved."
          ]
        },
        ar: {
          correct: "صحيح! صوت الصفير الحاد يعني أن أسطوانة الغاز على وشك الانفجار. ابتعد فوراً!",
          incorrect: "غير صحيح. الاقتراب من أسطوانة تصدر صفيراً يسبب إصابات انفجارية مميتة.",
          steps: [
            "1. اصرخ للجميع: 'خطر انفجار أسطوانة - تراجعوا فوراً!'.",
            "2. احتمِ خلف جدار قوي على بعد 100 متر على الأقل.",
            "3. أبلغ الدفاع المدني بوجود أسطوانات غاز مضغوطة بالنار."
          ]
        }
      }
    },
    {
      id: 204,
      roleId: "fire_suppression",
      title: { en: "FS-4: Electric Cables on Fire / Power Switched Off", ar: "إ4: حريق أسلاك والكهرباء مفصولة بالكامل" },
      description: {
        en: "Cables caught fire in the basement. The chief engineer confirms the main electricity switch IS OFF and zero voltage is tested.",
        ar: "حريق أسلاك كهربائية بالقبو. أكد المهندس أن القاطع الرئيسي مفصول تماماً والكهرباء صفر."
      },
      correctDecision: "FIGHT",
      drillImage: imgElectricalPanelLockout,
      feedback: {
        en: {
          correct: "CORRECT! The electricity is completely off, so there is no shock hazard. You can safely put out the fire.",
          incorrect: "INCORRECT. Backing away when the power is already off lets an ordinary fire grow bigger.",
          steps: [
            "1. Confirm with the engineer that electricity is 100% disconnected.",
            "2. Spray with powder or water mist at the base of the cables.",
            "3. Wear your mask so you do not breathe burning plastic fumes."
          ]
        },
        ar: {
          correct: "صحيح! الكهرباء مفصولة تماماً ولا يوجد خطر صعق. يمكنك إطفاء الحريق بأمان.",
          incorrect: "غير صحيح. التراجع والكهرباء مفصولة يسمح للحريق بالانتشار.",
          steps: [
            "1. تأكد تماماً مع المهندس من فصل التيار الكهربائي.",
            "2. رش البودرة أو رذاذ الماء على قاعدة الأسلاك المشتعلة.",
            "3. ارتدِ قناعك حتى لا تستنشق أدخنة البلاستيك المحترق."
          ]
        }
      }
    },
    {
      id: 205,
      roleId: "fire_suppression",
      title: { en: "FS-5: Air Tank Low Pressure Alarm Beeping", ar: "إ5: إنذار انخفاض هواء أسطوانة التنفس" },
      description: {
        en: "While searching a smoky basement corridor, your breathing mask alarm starts beeping loudly (only 25% air left).",
        ar: "أثناء البحث في ممر مليء بالدخان، بدأ جهاز التنفس يطلق صافرة تحذير (متبقي 25% فقط من الهواء)."
      },
      correctDecision: "FLEE",
      drillImage: imgScbaLowAir,
      feedback: {
        en: {
          correct: "CORRECT! Low air alarm means GET OUT NOW. The remaining air is only enough to reach the exit safely.",
          incorrect: "INCORRECT. Staying inside with low air leads to choking and passing out in the smoke.",
          steps: [
            "1. Tell your partner immediately: 'Low Air - We are leaving now'.",
            "2. Hold onto the wall or fire hose line to find the exit door.",
            "3. Report to the Team Leader outside so a fresh team can take over."
          ]
        },
        ar: {
          correct: "صحيح! جرس انخفاض الهواء يعني الخروج فوراً. الهواء المتبقي يكفيك فقط للوصول للمخرج.",
          incorrect: "غير صحيح. البقاء بالداخل بهواء منخفض يؤدي للاختناق وفقدان الوعي.",
          steps: [
            "1. أخبر زميلك فوراً: 'الهواء ينفد - نخرج الآن'.",
            "2. تتبع الجدار أو خرطوم المياه للوصول لباب الخروج بأمان.",
            "3. أبلغ قائد الفريق بالخارج لتبديلك بفرد آخر."
          ]
        }
      }
    },

    // ---------------- CASUALTY CARE (301 - 305) ----------------
    {
      id: 301,
      roleId: "casualty_care",
      title: { en: "CC-1: Heavy Bleeding in a Safe Hallway", ar: "ر1: نزيف شديد في ممر آمن" },
      description: {
        en: "A coworker has a deep leg cut from broken glass. Blood is spurting quickly. The area is clean, safe, and smoke-free.",
        ar: "أصيب زميل بجرح عميق في الساق من زجاج مكسور والدم يتدفق بقوة. الممر نظيف وآمن وخالٍ من الدخان."
      },
      correctDecision: "FIGHT",
      drillImage: imgTourniquetLegHallway,
      feedback: {
        en: {
          correct: "CORRECT! The area is safe. Spurting blood will cause death in minutes if you do not stop it right now.",
          incorrect: "INCORRECT. Moving the person without stopping the bleeding first can cause them to bleed to death.",
          steps: [
            "1. Wrap a tight medical tourniquet or cloth high on the injured leg.",
            "2. Twist and tighten firmly until the blood stops completely.",
            "3. Place the person on a stretcher and call for medical transport."
          ]
        },
        ar: {
          correct: "صحيح! المكان آمن. النزيف الشديد يؤدي للوفاة سريعاً إن لم توقفه فوراً.",
          incorrect: "غير صحيح. نقل المصاب دون إيقاف النزيف أولاً قد يفقده حياته.",
          steps: [
            "1. ضع رباطاً ضاغطاً (تورنيكيه) أعلى الساق المصابة بإحكام.",
            "2. شد الرباط جيداً حتى يتوقف تدفق الدم تماماً.",
            "3. ضع المصاب على النقالة لطلب نقله للمستشفى."
          ]
        }
      }
    },
    {
      id: 302,
      roleId: "casualty_care",
      title: { en: "CC-2: Unconscious Person in a Smoky Room", ar: "ر2: شخص فاقد للوعي في غرفة بها دخان" },
      description: {
        en: "You find someone passed out on the floor. Thick black smoke is dropping quickly from the ceiling to waist level.",
        ar: "وجدت شخصاً فاقداً للوعي على الأرض. والدخان الأسود الكثيف ينزل بسرعة من السقف لمستوى الخصر."
      },
      correctDecision: "FLEE",
      drillImage: imgUnconsciousSmokyRoom,
      feedback: {
        en: {
          correct: "CORRECT! Smoke is dropping fast and will knock you out. Drag the person out of the room immediately!",
          incorrect: "INCORRECT. Trying to check pulses or do CPR in heavy smoke will make you another victim.",
          steps: [
            "1. Grab the person by their clothes or arms and drag them out fast.",
            "2. Close the room door behind you to keep the smoke trapped.",
            "3. Check breathing and start CPR only once you reach clean outdoor air."
          ]
        },
        ar: {
          correct: "صحيح! الدخان ينزل بسرعة وسيخنقك. اسحب المصاب فوراً خارج الغرفة لمكان آمن!",
          incorrect: "غير صحيح. محاولة فحص النبض أو الإنعاش وسط الدخان الكثيف ستجعلك ضحية أخرى.",
          steps: [
            "1. اسحب المصاب من ملابسه بسرعة إلى خارج الغرفة فوراً.",
            "2. أغلق باب الغرفة خلفك لمنع خروج الدخان للممر.",
            "3. ابدأ بفحص التنفس والإسعاف فقط في الهواء النظيف."
          ]
        }
      }
    },
    {
      id: 303,
      roleId: "casualty_care",
      title: { en: "CC-3: Chemical Smoke Blowing Toward First Aid Station", ar: "ر3: دخان كيميائي يتجه لنقطة الإسعاف" },
      description: {
        en: "Wind changed direction. Strong chemical fumes are now blowing directly into your outdoor first aid tent in the yard.",
        ar: "تغير اتجاه الرياح. والآن تهب أبخرة كيميائية مباشرة نحو خيمة الإسعافات بالفناء."
      },
      correctDecision: "FLEE",
      drillImage: imgChemSmokeTent,
      feedback: {
        en: {
          correct: "CORRECT! A first aid station must stay clean and safe. Move your patients away from the chemical wind right away.",
          incorrect: "INCORRECT. Treating patients inside a chemical cloud poisons both patients and medical helpers.",
          steps: [
            "1. Shout that the first aid station is moving upwind right now.",
            "2. Move walking patients and stretchers to the safe clean zone.",
            "3. Set up first aid signs again in the clean air area."
          ]
        },
        ar: {
          correct: "صحيح! نقطة الإسعاف يجب أن تكون نقية. انقل المصابين فوراً بعيداً عن اتجاه الدخان الكيميائي.",
          incorrect: "غير صحيح. علاج المصابين داخل سحابة كيميائية يضر المصابين والمسعفين.",
          steps: [
            "1. أعلن فوراً نقل نقطة الإسعاف إلى منطقة نظيفة عكس الرياح.",
            "2. ساعد المصابين والنقالات على الانتقال للمكان الجديد بسرعة.",
            "3. أعد ترتيب أدوات الإسعاف في المنطقة النظيفة الجديدة."
          ]
        }
      }
    },
    {
      id: 304,
      roleId: "casualty_care",
      title: { en: "CC-4: Heart Stops in a Safe Breakroom", ar: "ر4: توقف القلب في استراحة آمنة" },
      description: {
        en: "An employee collapsed in a clean breakroom. They have no pulse and are not breathing. A shock machine (AED) is on the wall.",
        ar: "سقط موظف مغشياً عليه باستراحة آمنة. لا يوجد نبض ولا يتنفس، وجهاز الصدمات (AED) معلق بالجدار."
      },
      correctDecision: "FIGHT",
      drillImage: imgAedCardiacBreakroom,
      feedback: {
        en: {
          correct: "CORRECT! The room is safe. When a heart stops, push on the chest (CPR) and use the AED machine immediately.",
          incorrect: "INCORRECT. Waiting or moving the patient before starting CPR will cause brain death.",
          steps: [
            "1. Turn on the AED, stick the pads on their bare chest, and follow voice prompts.",
            "2. Push hard and fast on the center of the chest (30 presses, 2 breaths).",
            "3. Call the evacuation team to bring a transport stretcher."
          ]
        },
        ar: {
          correct: "صحيح! المكان آمن. عند توقف القلب يجب البدء بالضغط على الصدر واستخدام جهاز AED فوراً.",
          incorrect: "غير صحيح. تضييع الوقت في نقل المصاب قبل الإنعاش يسبب الوفاة.",
          steps: [
            "1. شغّل جهاز AED وضع اللصقات على صدر المصاب واتبع التعليمات الصوتية.",
            "2. اضغط بقوة وسرعة في منتصف الصدر (30 ضغطة ونفختين).",
            "3. اطلب من فريق الإخلاء تجهيز النقالة لنقله بأمان."
          ]
        }
      }
    },
    {
      id: 305,
      roleId: "casualty_care",
      title: { en: "CC-5: Person Covered in Dangerous Acid", ar: "ر5: مصاب مسكوب عليه حمض حارق" },
      description: {
        en: "A technician was splashed with burning acid. Their clothes and skin are wet with acid, and they have not washed with water yet.",
        ar: "انسكب حمض حارق على ملابس وجلد فني. السائل ما زال مبللاً على جلده ولم يغسله بالماء بعد."
      },
      correctDecision: "FLEE",
      drillImage: imgAcidSplashShower,
      feedback: {
        en: {
          correct: "CORRECT! Touching wet acid without protection will burn your own hands. Push them under the emergency shower first!",
          incorrect: "INCORRECT. Touching unwashed acid burns the helper and spreads the chemical.",
          steps: [
            "1. Tell the person to step under the emergency safety shower immediately.",
            "2. Put on rubber gloves and face shield before touching them.",
            "3. Flush skin with plenty of water for 15 minutes before applying medicine."
          ]
        },
        ar: {
          correct: "صحيح! لمس الحمض الرطب بيدك المجردة سيحرقك. وجّه المصاب لدش الطوارئ فوراً!",
          incorrect: "غير صحيح. لمس المواد الحارقة بدون حماية يصيب المسعف بحروق خطيرة.",
          steps: [
            "1. وجّه المصاب فوراً للوقوف تحت دش الطوارئ وغسل جلده بالماء.",
            "2. ارتدِ قفازات مطاطية وواقي الوجه قبل ملامسة المصاب.",
            "3. استمر بغسل الجلد بالماء لمدة 15 دقيقة قبل وضع أي مراهم."
          ]
        }
      }
    },

    // ---------------- EVACUATION SUPPORT (401 - 405) ----------------
    {
      id: 401,
      roleId: "evacuation_support",
      title: { en: "ES-1: Plastic Chair Blocking Clear Stairs", ar: "د1: كرسي بلاستيكي يعيق درجا نظيفا" },
      description: {
        en: "Stairwell A has no smoke. A fallen plastic chair is partially blocking the step. People are walking down calmly.",
        ar: "سلم الطوارئ (A) نظيف وبدون دخان. يوجد كرسي بلاستيكي ساقط يعيق الخطوات، والناس ينزلون بهدوء."
      },
      correctDecision: "FIGHT",
      drillImage: imgStairwellChairClear,
      feedback: {
        en: {
          correct: "CORRECT! The stairs are smoke-free. Simply kick or move the chair out of the way to keep people moving.",
          incorrect: "INCORRECT. Closing a safe staircase for an easy-to-move chair causes big crowds in other exits.",
          steps: [
            "1. Kick or move the plastic chair completely off the stairs.",
            "2. Guide people to keep to the right side and hold the handrail.",
            "3. Keep the line moving smoothly down to the ground exit."
          ]
        },
        ar: {
          correct: "صحيح! السلم آمن ونظيف. أزح الكرسي البلاستيكي فوراً لتسهيل نزول الناس.",
          incorrect: "غير صحيح. إغلاق سلم آمن بسبب كرسي يمكن رفعه بسهولة يسبب تكدساً في مخارج أخرى.",
          steps: [
            "1. أزح الكرسي البلاستيكي تماماً بعيداً عن مسار الدرج.",
            "2. وجّه الناس بالنزول بهدوء والالتزام بالجانب الأيمن ومسك الدرابزين.",
            "3. حافظ على استمرار حركة النزول حتى المخرج الأرضي."
          ]
        }
      }
    },
    {
      id: 402,
      roleId: "evacuation_support",
      title: { en: "ES-2: Hot Stair Door Leaking Black Smoke", ar: "د2: باب السلم ساخن ويسرب دخانا أسود" },
      description: {
        en: "You are guiding 20 people to Stairwell B. Touching the door handle, you feel burning heat and see black smoke leaking from the edges.",
        ar: "تقود 20 شخصاً نحو مخرج السلم (B). لمست مقبض الباب فوجدته ساخناً جداً والدخان الأسود يتسرب من الحواف."
      },
      correctDecision: "FLEE",
      drillImage: imgHotStairDoor,
      feedback: {
        en: {
          correct: "CORRECT! Never open a hot, smoking door! There is a raging fire inside that staircase. Turn around!",
          incorrect: "INCORRECT. Opening that door will blow lethal flames and smoke directly into your hallway.",
          steps: [
            "1. Do NOT open the fire door.",
            "2. Turn your group around immediately toward Stairwell C.",
            "3. Tell the Team Leader on the radio: 'Stairwell B is blocked by fire'."
          ]
        },
        ar: {
          correct: "صحيح! إياك أن تفتح باباً ساخناً يتسرب منه الدخان! الحريق مشتعل بداخل الدرج. استدر فوراً!",
          incorrect: "غير صحيح. فتح هذا الباب سيندفع منه لهب ودخان قاتل ليخنق مجموعتك بالدور.",
          steps: [
            "1. لا تفتح الباب المقاوم للحريق نهائياً.",
            "2. وجّه مجموعتك فوراً للعودة نحو سلم الطوارئ البديل (C).",
            "3. أبلغ قائد الفريق عبر اللاسلكي: 'السلم B مشتعل ومغلق بالكامل'."
          ]
        }
      }
    },
    {
      id: 403,
      roleId: "evacuation_support",
      title: { en: "ES-3: Crowded Pushing at the Exit Door", ar: "د3: تزاحم وتدافع عند باب الخروج" },
      description: {
        en: "Staff are panicking and pushing against an exit door because it opened inward. The stairs are safe and structurally sound.",
        ar: "أصاب الموظفين الهلع ويتدافعون عند باب المخرج لأنه يفتح للداخل. السلم سليم وآمن تماماً."
      },
      correctDecision: "FIGHT",
      drillImage: imgEvacuationDoorCrowd,
      feedback: {
        en: {
          correct: "CORRECT! Take charge! Hold the door wide open and give loud, calm directions so nobody gets trampled.",
          incorrect: "INCORRECT. Walking away while people are panicking causes crushing and falling injuries.",
          steps: [
            "1. Shout in a strong, calm voice: 'STOP PUSHING - MAKE TWO LINES'.",
            "2. Use your hands to hold the exit door open as wide as possible.",
            "3. Walk people out in an orderly single file."
          ]
        },
        ar: {
          correct: "صحيح! تولّ القيادة! ثبّت الباب مفتوحاً ونادِ بصوت حازم وهادئ لمنع التدافع والإصابات.",
          incorrect: "غير صحيح. ترك الناس وهم في حالة هلع يؤدي لسقوطهم وإصابات دهس خطيرة.",
          steps: [
            "1. نادِ بصوت قيادي حازم: 'توقفوا عن التدافع - انتظموا في صفين'.",
            "2. امسك الباب وافتحه بالكامل بيدك لمنع انغلاقه.",
            "3. مرر الأشخاص بانتظام وهدوء عبر فتحة الباب."
          ]
        }
      }
    },
    {
      id: 404,
      roleId: "evacuation_support",
      title: { en: "ES-4: Smoke Cloud Moving Over Assembly Area", ar: "د4: سحابة دخان تتجه لمنطقة التجمع الخارجية" },
      description: {
        en: "200 office workers are waiting at Outdoor Assembly Point A. Wind shifts, pushing a thick black smoke cloud right over them.",
        ar: "200 موظف يقفون بنقطة التجمع الخارجية (A). تغيرت الرياح وبدأت سحابة دخان أسود تتجه فوق رؤوسهم."
      },
      correctDecision: "FLEE",
      drillImage: imgSmokePlumeAssembly,
      feedback: {
        en: {
          correct: "CORRECT! Never let people breathe smoke outdoors. Walk the whole group across the yard to Safe Point B immediately.",
          incorrect: "INCORRECT. Leaving people standing under a smoke cloud causes mass smoke inhalation.",
          steps: [
            "1. Blow your emergency whistle and tell the crowd to start walking.",
            "2. Walk the group across the wind toward Safe Assembly Point B.",
            "3. Inform the Team Leader of the crowd's new safe location."
          ]
        },
        ar: {
          correct: "صحيح! لا تدع الموظفين يستنشقون الدخان بالخارج. حرّك الجميع فوراً نحو النقطة البديلة (B).",
          incorrect: "غير صحيح. إبقاء الموظفين تحت سحابة الدخان يسبب اختناقاً جماعياً في ساحة المطار.",
          steps: [
            "1. استخدم صفارة الطوارئ وأمر الجميع بالتحرك فوراً.",
            "2. قد الجموع بشكل جانبي لاتجاه الرياح نحو نقطة التجمع (B).",
            "3. أبلغ قائد الفريق بالموقع الجديد الآمن للجميع."
          ]
        }
      }
    },
    {
      id: 405,
      roleId: "evacuation_support",
      title: { en: "ES-5: Lights Went Out in Dark Hallway", ar: "د5: انقطاع الأنوار في ممر داخلي مظلم" },
      description: {
        en: "Emergency lights went off in an inside hallway. It is pitch dark, but green glowing floor lines are bright and you have a flashlight.",
        ar: "انطفأت أضواء الطوارئ بممر داخلي. المكان مظلم، لكن الخطوط الأرضية الفوسفورية تضيء بوضوح ومعك كشاف قوي."
      },
      correctDecision: "FIGHT",
      drillImage: imgDarkHallwayGlow,
      feedback: {
        en: {
          correct: "CORRECT! You have a flashlight and the glowing floor lines show the way. Lead the people out safely.",
          incorrect: "INCORRECT. Freezing or running away in the dark makes people panic and lose their way.",
          steps: [
            "1. Turn on your bright flashlight right away.",
            "2. Call out loudly: 'FOLLOW MY LIGHT AND THE GLOWING FLOOR STRIPES'.",
            "3. Lead everyone calmly into the lit exit staircase."
          ]
        },
        ar: {
          correct: "صحيح! معك كشاف والخطوط الفوسفورية واضحة بالأرض. أرشد الناس واخرج بهم بأمان.",
          incorrect: "غير صحيح. التردد أو الهروب في الظلام يثير الذعر ويجعل الموظفين يتخبطون.",
          steps: [
            "1. شغّل كشافك اليدوي القوي على الفور.",
            "2. نادِ بوضوح: 'اتبعوا ضوء الكشاف والخطوط المضيئة على الأرض'.",
            "3. قُد الجميع بهدوء حتى باب السلم المضاء."
          ]
        }
      }
    },

    // ---------------- LIAISON (501 - 505) ----------------
    {
      id: 501,
      roleId: "liaison",
      title: { en: "LN-1: Civil Defense Fire Trucks Arrive at Gate 2", ar: "ل1: وصول آليات الدفاع المدني للبوابة (2)" },
      description: {
        en: "The first Civil Defense fire engine arrived at Gate 2. The area is clean, safe, and you are holding the building maps and hazard binders.",
        ar: "وصلت أول سيارة إطفاء للدفاع المدني للبوابة (2). الموقع آمن ونظيف، وأنت تحمل مخططات المبنى ومعلومات السلامة بيدك."
      },
      correctDecision: "FIGHT",
      drillImage: imgFiretruckGateArrival,
      feedback: {
        en: {
          correct: "CORRECT! The gate is completely safe. Greet the fire chief immediately and hand over maps and hazard information.",
          incorrect: "INCORRECT. Walking away when emergency crews arrive wastes critical minutes for rescue.",
          steps: [
            "1. Walk up to the Civil Defense Commander right away.",
            "2. Hand over building blueprints and chemical safety sheets.",
            "3. Report the current headcount and what your ERT team has done so far."
          ]
        },
        ar: {
          correct: "صحيح! البوابة آمنة تماماً. استقبل قائد فرقة الإطفاء فوراً وسلّمه المخططات ومعلومات الحادث.",
          incorrect: "غير صحيح. الابتعاد عند وصول الدفاع المدني يضيع دقائق ثمينة جداً لإنقاذ الأرواح.",
          steps: [
            "1. توجه مباشرة لقائد فرقة الدفاع المدني عند وصوله.",
            "2. سلّمه مخططات المبنى وقائمة المواد الخطرة فوراً.",
            "3. أطلعه على عدد الموظفين والإجراءات التي نفذها فريق ERT."
          ]
        }
      }
    },
    {
      id: 502,
      roleId: "liaison",
      title: { en: "LN-2: Toxic Gas Enters Main Reception Gate", ar: "ل2: تسرب غاز سام باتجاه البوابة الرئيسية" },
      description: {
        en: "A wind shift pushed toxic gas fumes over Gate 2. The air smells strongly of chemicals. Incoming fire engines are 1 minute away.",
        ar: "تغير الهواء ودفع غازات سامة نحو البوابة (2). الرائحة الكيميائية قوية وسيارات الدفاع المدني على بعد دقيقة واحدة."
      },
      correctDecision: "FLEE",
      drillImage: imgToxicGasGate,
      feedback: {
        en: {
          correct: "CORRECT! Gate 2 is poisoned by gas. Move immediately to Gate 4 and radio the fire trucks to change gates!",
          incorrect: "INCORRECT. Standing in toxic gas will knock you out before you can talk to the incoming fire crew.",
          steps: [
            "1. Call Civil Defense dispatch by radio or phone right away.",
            "2. Tell fire trucks to reroute to Gate 4 (clean air gate).",
            "3. Move your liaison post to Gate 4 immediately."
          ]
        },
        ar: {
          correct: "صحيح! البوابة (2) ملوثة بالغاز. انتقل فوراً للبوابة (4) ووجّه آليات الإطفاء لتغيير مسارها!",
          incorrect: "غير صحيح. الوقوف وسط الغاز السام سيفقدك الوعي قبل أن تلتقي بفرق الإطفاء.",
          steps: [
            "1. اتصل بعمليات الدفاع المدني باللاسلكي أو الهاتف فوراً.",
            "2. اطلب من سيارات الإطفاء التوجه إلى البوابة (4) النظيفة.",
            "3. انقل موقعك فوراً إلى البوابة (4) لاستقبالهم بأمان."
          ]
        }
      }
    },
    {
      id: 503,
      roleId: "liaison",
      title: { en: "LN-3: Crowd and Cameras Blocking Emergency Vehicles", ar: "ل3: تجمهر وكاميرات تعيق سيارات الطوارئ" },
      description: {
        en: "Curious people and reporters are crowding around your gate table, blocking the driveway where ambulances need to enter.",
        ar: "يتجمهر أشخاص ومصورون حول طاولتك عند البوابة، مما يعيق طريق دخول سيارات الإسعاف والإطفاء."
      },
      correctDecision: "FLEE",
      drillImage: imgCrowdBlockingAmbulance,
      feedback: {
        en: {
          correct: "CORRECT! Do not argue in vehicle lanes. Move inside the airport security booth and ask airport police to clear the driveway.",
          incorrect: "INCORRECT. Arguing in the middle of the road keeps emergency vehicles blocked from reaching victims.",
          steps: [
            "1. Ask Airport Police to clear the crowd and open the road.",
            "2. Move your communication desk inside the secure Gate 1 guardhouse.",
            "3. Keep the vehicle lane 100% open for arriving fire and ambulance units."
          ]
        },
        ar: {
          correct: "صحيح! لا تجادل في مسار السيارات. ادخل كابينة الأمن واطلب من أمن المطار إخلاء الطريق فوراً.",
          incorrect: "غير صحيح. الوقوف للجدال في وسط الطريق يعطل وصول سيارات الإسعاف للمصابين.",
          steps: [
            "1. اطلب من شرطة وأمن المطار إبعاد المتجمهرين وفتح الطريق.",
            "2. انقل موقع اتصالاتك لداخل كابينة الحراسة الآمنة بالبوابة (1).",
            "3. حافظ على مسار السيارات خالياً تماماً لسيارات الإسعاف والإطفاء."
          ]
        }
      }
    },
    {
      id: 504,
      roleId: "liaison",
      title: { en: "LN-4: Handing Over Command to Civil Defense Chief", ar: "ل4: تسليم القيادة رسميا لمدير الدفاع المدني" },
      description: {
        en: "Civil Defense Chief stepped into the safe command vehicle. Maps, victim counts, and hazard details are ready on your clipboard.",
        ar: "دخل قائد الدفاع المدني سيارة القيادة الآمنة. المخططات، أعداد المصابين، وتفاصيل الحادث جاهزة بيدك."
      },
      correctDecision: "FIGHT",
      drillImage: imgIncidentCommandHandover,
      feedback: {
        en: {
          correct: "CORRECT! The command vehicle is safe. Deliver a crisp, clear verbal briefing so Civil Defense can take charge smoothly.",
          incorrect: "INCORRECT. Walking away during a critical command transfer leaves government emergency forces blind.",
          steps: [
            "1. Deliver your short tactical briefing using your checklist.",
            "2. Remain beside the Civil Defense Chief as their airport guide.",
            "3. Keep giving them real-time updates from your internal ERT teams."
          ]
        },
        ar: {
          correct: "صحيح! مركبة القيادة آمنة. قدّم تقريرك بوضوح وثقة ليتسلم الدفاع المدني إدارة الحادث بنجاح.",
          incorrect: "غير صحيح. التراجع أثناء تسليم القيادة يترك القوات الحكومية بدون معلومات حاسمة.",
          steps: [
            "1. قدّم إيجازك التكتيكي المنظم مستعيناً بقائمتك.",
            "2. ابقَ بجانب قائد الدفاع المدني كمرجع له داخل المطار.",
            "3. زوّدهم بأحدث المستجدات من فرق ERT الداخلية باستمرار."
          ]
        }
      }
    },
    {
      id: 505,
      roleId: "liaison",
      title: { en: "LN-5: Mobile Phones Down / Emergency Radios Working", ar: "ل5: تعطل شبكة الجوال مع عمل اللاسلكي" },
      description: {
        en: "Mobile phone networks stopped working across the area. However, your dedicated VHF emergency radio channel to Civil Defense works perfectly.",
        ar: "انقطعت شبكة الجوال بالمنطقة بالكامل. لكن قناة اللاسلكي المخصصة (VHF) مع الدفاع المدني تعمل بكفاءة عالية."
      },
      correctDecision: "FIGHT",
      drillImage: imgTwoWayRadioDrill,
      feedback: {
        en: {
          correct: "CORRECT! Your tactical radio is loud and clear. Stay on your radio and keep the communication link open.",
          incorrect: "INCORRECT. Abandoning your post because mobile phones failed cuts off the only working radio link.",
          steps: [
            "1. Switch your radio to Channel 4 (Civil Defense Direct).",
            "2. Say: 'Airport Liaison radio check - do you copy?'.",
            "3. Continue your liaison role using standard radio procedures."
          ]
        },
        ar: {
          correct: "صحيح! جهاز اللاسلكي يعمل بوضوح ممتاز. ابقَ في مكانك واستمر في توجيه الاتصالات عبر اللاسلكي.",
          incorrect: "غير صحيح. ترك موقعك بسبب انقطاع الجوال يقطع قناة الاتصال الوحيدة المتبقية.",
          steps: [
            "1. اضبط اللاسلكي على القناة رقم 4 (مباشر الدفاع المدني).",
            "2. أجرِ اختبار اتصال: 'عمليات المطار معكم - هل تسمعونني؟'.",
            "3. واصل مهامك التنسيقية مستخدماً اللاسلكي بانتظام."
          ]
        }
      }
    }
  ]
};

export const I18N = {
  en: {
    appTitle: "KSIA ERT SIMULATOR",
    appSubtitle: "KING SALMAN INTL AIRPORT • RIYADH",
    langToggleLabel: "العربية (AR)",
    statusPrefix: "SYSTEM READY • ",
    stateScreen0: "REGISTRATION",
    stateScreen1Role1: "SELECT PRIMARY ROLE (1 OF 3)",
    stateScreen1Role2: "SELECT SECONDARY ROLE (2 OF 3)",
    stateScreen1Role3: "SELECT TERTIARY ROLE (3 OF 3)",
    stateScreen2: "SCENARIO %idx% OF 5",
    stateScreen3: "OFFICIAL AUDIT REPORT",
    sessionReady: "DEFENSE READY",
    tagScreen0: "STAGE 01 // REGISTRATION",
    titleScreen0: "ERT Qualification Registration",
    descScreen0: "Enter your official credentials. To pass the qualification, you must successfully complete three ERT roles with at least 70% in each.",
    lblFullName: "Full Name",
    helpFullName: "Official name as registered in KSIA security records.",
    lblEmpId: "Employee ID",
    helpEmpId: "Your airport security badge number.",
    lblDate: "Assessment Date",
    helpDate: "Defaults to today's duty date.",
    boxDirective: "<strong>KSIA Emergency Protocol:</strong> You must successfully complete <strong>3 ERT roles</strong>. Each role has 5 practical drill scenarios with high-resolution situational photos and a countdown clock. Passing score is <strong>70%</strong> for each role.",
    btnStart: "START TACTICAL ASSESSMENT",
    tagScreen1Primary: "STAGE 02 // PRIMARY ROLE (1/3)",
    tagScreen1Secondary: "STAGE 02 // SECONDARY ROLE (2/3)",
    tagScreen1Tertiary: "STAGE 02 // TERTIARY ROLE (3/3)",
    titleScreen1Primary: "Select Your Primary ERT Role",
    titleScreen1Secondary: "Select Your Secondary ERT Role",
    titleScreen1Tertiary: "Select Your Third ERT Role",
    descScreen1Primary: "Choose your first operational role to begin the tactical decision scenarios.",
    descScreen1Secondary: "You passed your first role! Now choose your second required ERT role.",
    descScreen1Tertiary: "Excellent! You passed the secondary role. Now select your third required ERT role to complete certification.",
    rolePassedBadge: "COMPLETED & PASSED ✓",
    lblLocationPrefix: "KSIA Admin Complex",
    lblSituation: "WHAT IS HAPPENING (SCENARIO DRILL)",
    promptDecision: "MAKE YOUR DECISION BEFORE TIME RUNS OUT",
    btnFight: "FIGHT / ACT",
    btnFightSub: "Take Action in Place",
    btnFlee: "FLEE / EVACUATE",
    btnFleeSub: "Fall Back to Safety",
    feedbackCorrectTitle: "✓ DECISION CORRECT",
    feedbackIncorrectTitle: "✕ INCORRECT DECISION",
    feedbackTimeoutTitle: "⏱ TIME EXPIRED — HESITATION IN EMERGENCY",
    recapChosen: "Your Choice:",
    recapRequired: "Correct Action:",
    lblProtocol: "HOW TO HANDLE THIS (SOP):",
    btnNext: "NEXT SCENARIO",
    btnFinishRole1: "CHECK ROLE 1 SCORE",
    btnFinishRole2: "CHECK ROLE 2 SCORE",
    btnFinishRole3: "VIEW FINAL QUALIFICATION REPORT",
    timerLabel: "DECISION TIME",
    timerSeconds: "sec",
    timeRanOutMsg: "Time expired! In an emergency, deciding too late puts lives in danger. Review the correct action below:"
  },
  ar: {
    appTitle: "محاكي الطوارئ التكتيكي - مطار الملك سلمان",
    appSubtitle: "مطار الملك سلمان الدولي • الرياض",
    langToggleLabel: "English (EN)",
    statusPrefix: "النظام جاهز • ",
    stateScreen0: "تسجيل المشارك",
    stateScreen1Role1: "اختيار الدور الأول (1 من 3)",
    stateScreen1Role2: "اختيار الدور الثاني (2 من 3)",
    stateScreen1Role3: "اختيار الدور الثالث (3 من 3)",
    stateScreen2: "السيناريو %idx% من 5",
    stateScreen3: "تقرير التدقيق الرسمي",
    sessionReady: "جاهزية تامة",
    tagScreen0: "المرحلة 01 // تسجيل المتدرب",
    titleScreen0: "تسجيل بيانات تقييم فريق الطوارئ (ERT)",
    descScreen0: "أدخل بياناتك الرسمية. لاجتياز التقييم، يجب عليك إكمال ثلاثة أدوار تكتيكية بنجاح وبنسبة 70% على الأقل لكل منها.",
    lblFullName: "الاسم الكامل",
    helpFullName: "الاسم المعتمد في سجلات أمن مطار الملك سلمان.",
    lblEmpId: "الرقم الوظيفي",
    helpEmpId: "رقم البطاقة الأمنية أو الهوية الوظيفية.",
    lblDate: "تاريخ التقييم",
    helpDate: "تاريخ اليوم تلقائياً.",
    boxDirective: "<strong>بروتوكول طوارئ مطار الملك سلمان:</strong> يجب إكمال <strong>3 أدوار تكتيكية</strong> بنجاح. يحتوي كل دور على 5 تدريبات عملية مصورة مع مؤقت زمني. درجة النجاح المطلوبة هي <strong>70%</strong> لكل دور.",
    btnStart: "بدء التقييم التكتيكي",
    tagScreen1Primary: "المرحلة 02 // الدور الأول (1 من 3)",
    tagScreen1Secondary: "المرحلة 02 // الدور الثاني (2 من 3)",
    tagScreen1Tertiary: "المرحلة 02 // الدور الثالث (3 من 3)",
    titleScreen1Primary: "اختر دورك التكتيكي الأول",
    titleScreen1Secondary: "اختر دورك التكتيكي الثاني",
    titleScreen1Tertiary: "اختر دورك التكتيكي الثالث والأخير",
    descScreen1Primary: "اختر دورك الميداني الأول لبدء سيناريوهات الاستجابة السريعة.",
    descScreen1Secondary: "أحسنت! اجتزت الدور الأول. الآن اختر دورك الثاني الإلزامي.",
    descScreen1Tertiary: "ممتاز! اجتزت الدور الثاني. الآن اختر دورك الثالث لإكمال شهادة التأهيل المعتمدة.",
    rolePassedBadge: "تم الاجتياز بنجاح ✓",
    lblLocationPrefix: "مجمع إدارة مطار الملك سلمان",
    lblSituation: "ماذا يحدث في الموقع (التدريب العملي)",
    promptDecision: "اتخذ قرارك قبل انتهاء الوقت",
    btnFight: "مكافحة / تدخل فوري",
    btnFightSub: "المواجهة والمعالجة في الموقع",
    btnFlee: "انسحاب / إخلاء فوري",
    btnFleeSub: "التراجع إلى بر الأمان",
    feedbackCorrectTitle: "✓ قرار صحيح وممتاز",
    feedbackIncorrectTitle: "✕ قرار غير صحيح",
    feedbackTimeoutTitle: "⏱ انتهى الوقت — التردد خطر في الطوارئ",
    recapChosen: "قرارك:",
    recapRequired: "الإجراء الصحيح المطلوب:",
    lblProtocol: "خطوات التعامل القياسية (SOP):",
    btnNext: "السيناريو التالي",
    btnFinishRole1: "عرض نتيجة الدور الأول",
    btnFinishRole2: "عرض نتيجة الدور الثاني",
    btnFinishRole3: "إصدار التقرير النهائي المعتمد",
    timerLabel: "الوقت المتبقي",
    timerSeconds: "ثانية",
    timeRanOutMsg: "انتهى الوقت! التردد والتأخر في اتخاذ القرار يكلف أرواحاً. تعرّف على الإجراء الصحيح أدناه:"
  }
};
