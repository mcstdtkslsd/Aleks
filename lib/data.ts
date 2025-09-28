import React from "react";
import { FaReact } from "react-icons/fa";
import { FaVuejs } from "react-icons/fa";
import { LuGraduationCap } from "react-icons/lu";
import knowledgeSharingPlatformImage from '@/public/运河行迹.jpg';
import breadditImage from "@/public/breaddit.png";
import gameHubImage from "@/public/game-hub.png";
import typingSpeedImage from "@/public/loci-vr.jpg";
import visualizationImage from "@/public/古物寻迹.jpg";

export const links = [
    {
        name: "Home",
        hash: "#home",
    },
    {
        name: "About",
        hash: "#about",
    },
    {
        name: "Projects",
        hash: "#projects",
    },
    {
        name: "Experiences",
        hash: "#experience",
    },
    // {
    //     name: "Contact",
    //     hash: "#contact",
    // },
] as const;


export const headerLanguageMap = {
    Home: '首页',
    About: '关于我',
    Projects: '我的项目',
    Experiences: '我的经历',
}

export const experiencesData = [
    {
        title: "Computer and Information Technology Master",
        location: "University of St Andrews, UK",
        date: "September 2023 - December 2024",
        description: "In-depth study in human-computer interaction, computer communication systems, and information security. Developed strong skills in computational thinking, user-centered design, and data visualization. Expected to graduate with a first-class degree (GPA 17/20).",
        icon: "graduation-cap", // 修改：使用字符串代替React组件
    },
    {
        title: "Frontend Intern",
        location: React.createElement("span", {},
            React.createElement("a", {
                href: "https://www.nio.com/",
                style: { textDecoration: 'underline' },
                target: "_blank"
            }, "NIO Inc."),
            " Wuhan, China"
        ),
        description:
            "Developed NIO's third-generation station list and detail pages using Vue3, TypeScript, and Baidu Maps API. Implemented role-based access control for the Task Wizard page, enhancing system security. Collaborated effectively within a Jira-managed environment, utilizing Jenkins for deployment processes.",
        icon: React.createElement(FaVuejs),
        date: "2022 Aug - 2022 Dec",
    },
    {
        title: "Frontend Assistant",
        location: "Wuhan University | Wuhan, China",
        description:
            "Developed and maintained Finknow, a Financial Knowledge Graph Query and Analysis Platform using umi (React framework) and Ant Design Pro. Utilized graphin, a React toolkit for graph analysis based on G6, to develop an Equity Network Penetration Graph, enhancing data visualization capabilities.",
        icon: React.createElement(FaReact),
        date: "2022 May - 2022 July",
    },
    {
        title: "BA in Digital Publishing",
        location: "Wuhan University, China",
        description:
            "Graduated with a Bachelor of Arts in Digital Publishing, securing a GPA of 3.81/4.0. Gained foundational knowledge in digital media and publishing technologies.",
        icon: React.createElement(LuGraduationCap),
        date: "2019 Sep - 2023 Jun",
    },

]

export const experiencesDataZn = [
    {
        "title": "市场部专员实习",
        "location": "德马科技股份有限公司",
        "description": "·实习期间进行产品图渲染，资料筛选整理和文本编辑工作，协助进行布展设计和海报制作。",
        "icon": React.createElement(FaReact),
        "date": "2024年7月 - 2024年8月"
    },
    {
        "title": "本科毕业",
        "location": "浙江万里学院",
        "description": "学习建模软件，场景和动画设计，游戏开发和设计，平面设计，交互装置，产品设计，用户调研等知识。",
        "icon": React.createElement(LuGraduationCap),
        "date": "2022年9月 - 2026年6月"
    }
]


export type ProjectTags = typeof projectsData[number]["tags"];

export const projectsData = [
    {
        "title": "古物寻迹沉浸式VR游戏",
        "title_zh": "古物寻迹沉浸式VR游戏",
        "description":
            "《古物寻迹》主题沉浸式VR游戏由我主要负责交互设计和代码部分的制作。《古物寻迹》以运河文化为核心切入点，以“解谜”、“罗盘”、“祭坛”、“祈雨”、“击鼓”为主要关键词，运用虚实结合的方式带领玩家穿越古今，探索运河古物背后的神秘故事，让玩家在体验的过程中感受运河文化的独特魅力。",
        "desc_zh": "《古物寻迹》主题沉浸式VR游戏由我主要负责交互设计和代码部分的制作。《古物寻迹》以运河文化为核心切入点，以“解谜”、“罗盘”、“祭坛”、“祈雨”、“击鼓”为主要关键词，运用虚实结合的方式带领玩家穿越古今，探索运河古物背后的神秘故事，让玩家在体验的过程中感受运河文化的独特魅力。",
        "tags": ["Unity", "Blender", "C#", "PS"],
        "imageUrl": visualizationImage,
        "projectUrl": "https://github.com/Codefreyy/world-wealth-visualization",
        "demoUrl": "https://world-wealth-visualization.netlify.app/"
    },
    {
        "title": "运河行迹游戏",
        "title_zh": "运河行迹游戏",
        "description":
            "A collaborative platform enhancing cooperation among Scottish higher education institutions in digital ethics.",
        "desc_zh": "《运河行迹》主题科普游戏由我主要负责场景设计和交互设计部分的制作。《运河行迹》以运河文化为核心切入点，让玩家乘坐运河舟楫，欣赏运河沿岸六座不同城市的标志性建筑，感受各地因运河文化而兴起的独特建筑特色。",
        "tags": ["Unity", "Blender", "C#", "PS"],
        "imageUrl": knowledgeSharingPlatformImage,
        "projectUrl": "https://github.com/Codefreyy/Ethical-Digital-Nation",
        "demoUrl": "https://yujie-ethical-digital-nation.netlify.app/"
    },
    {
        title: "Loci VR Game",
        title_zh: 'Loci VR Game',
        description:
            "A comprehensive typing speed test application that tracks your overall typing performance. It provides detailed statistics, including total words typed, errors made, and accuracy rate, allowing users to monitor their progress and improve their typing efficiency.",
        desc_zh: "《Loci VR》学术性沉浸式VR游戏由我主要负责交互设计和代码部分的制作。《Loci VR》旨在探究“记忆宫殿”这一记忆法的有效和高效性，以VR作为载体，将玩家带入真实的“记忆宫殿”，将抽象的记忆法转化为可见的虚拟场景供玩家自由探索，探究不同的记忆场景和记忆模式（指引模式/探索模式）对记忆效果的差别。",
        tags: ["Unity", "Blender", "C#", 'PS'],
        imageUrl: typingSpeedImage,
        projectUrl: 'https://github.com/Codefreyy/typing-speed-game',
        demoUrl: 'https://joy-typing-speed.netlify.app/',
    },


]

export const skillsData = [
    "Unity",
    "Blender",
    "AE",
    "PS",
    "AI",
    "剪映",
    "Figma", 
    "Arduino",
    "UI/UX"
] 
