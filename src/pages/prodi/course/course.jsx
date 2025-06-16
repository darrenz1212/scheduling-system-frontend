import React, { useState, useRef, useEffect } from "react";
import ProdiNav from "../prodiNav.jsx";
import AllCourse from "./allCourse.jsx";
import ActiveCourse from "./activeCourse.jsx";

export default function Course() {
    const [activeTab, setActiveTab] = useState("aktif");
    const [underlineStyle, setUnderlineStyle] = useState({});
    const tabRefs = {
        aktif: useRef(null),
        list: useRef(null),
    };

    useEffect(() => {
        const currentTab = tabRefs[activeTab].current;
        if (currentTab) {
            setUnderlineStyle({
                width: currentTab.offsetWidth,
                left: currentTab.offsetLeft,
            });
        }
    }, [activeTab]);

    return (
        <div className="flex min-h-screen bg-gray-100">
            <ProdiNav />
            <div className="ml-auto mr-20 w-7/12 max-w-5xl bg-white h-full shadow-lg rounded-lg p-6 mt-5">
                {/* Tabs */}
                <div className="relative border-b border-gray-300 mb-6">
                    <div className="flex">
                        {["aktif", "list"].map((tab) => (
                            <button
                                key={tab}
                                ref={tabRefs[tab]}
                                onClick={() => setActiveTab(tab)}
                                className={`relative px-4 py-2 text-md font-medium capitalize transition-all ${
                                    activeTab === tab
                                        ? "text-[#0db0bb]"
                                        : "text-gray-600 hover:text-[#0db0bb]"
                                }`}
                            >
                                {tab === "aktif" ? "Mata Kuliah Aktif" : "List Mata Kuliah"}
                            </button>
                        ))}
                    </div>

                    {/* Animated Underline */}
                    <span
                        className="absolute bottom-0 h-[2px] bg-[#0db0bb] transition-all duration-300"
                        style={{
                            width: underlineStyle.width,
                            left: underlineStyle.left,
                        }}
                    />
                </div>

                {/* Content */}
                <div>
                    {activeTab === "aktif" ? <ActiveCourse /> : <AllCourse />}
                </div>
            </div>
        </div>
    );
}
