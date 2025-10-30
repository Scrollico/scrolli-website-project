"use client";
import Link from "next/link";
import { useState } from "react";
import Image from 'next/image';
import CityClockRow from "./CityClockRow";
import CardNav from "./CardNav";

export default function Header({ scroll, onNewsletterClick }: any) {
  const [isSearch, setIsSearch] = useState<number | null>(null);

  const handleSearch = (key: number) => {
    setIsSearch((prevState) => (prevState === key ? null : key));
  };

  // Dark/Light
  const [isDark, setDark] = useState<boolean>(false);
  const handleDark = (): void => {
    setDark(!isDark);
    !isDark ? document.body.classList.add("dark-mode") : document.body.classList.remove("dark-mode");
  };

  // Pass these to CardNav
  const headerProps = {
    isSearch,
    handleSearch,
    isDark,
    handleDark,
    onNewsletterClick
  };
  // CardNav menu items configuration
  const cardNavItems = [
    {
      label: "Discover",
      bgColor: "#0D0716",
      textColor: "#fff",
      links: [
        { label: "Explore Content", ariaLabel: "Discover new content" },
        { label: "Latest Articles", ariaLabel: "Read latest articles" },
        { label: "Trending Topics", ariaLabel: "See trending topics" }
      ]
    },
    {
      label: "Alara AI",
      bgColor: "#170D27",
      textColor: "#fff",
      links: [
        { label: "AI Features", ariaLabel: "Explore AI capabilities" },
        { label: "Smart Assistant", ariaLabel: "Meet our AI assistant" },
        { label: "Integration", ariaLabel: "API integration" }
      ]
    },
    {
      label: "Business",
      bgColor: "#271E37",
      textColor: "#fff",
      links: [
        { label: "Solutions", ariaLabel: "Business solutions" },
        { label: "Enterprise", ariaLabel: "Enterprise services" },
        { label: "Contact Sales", ariaLabel: "Get in touch with sales" }
      ]
    }
  ];

  return (
    <>
      <header id="header" className="d-lg-block d-none">
        <div className="container">
          <div className="header-inner d-flex align-items-center justify-content-between w-100">
            <div className="logo-stack d-flex align-items-center">
            </div>
          </div>
          <div className="clearfix" />
        </div>
        {/* CardNav Menu */}
                <CardNav
                  logo="/assets/images/Standart/Primary-alternative.png"
                  logoAlt="Merinda Logo"
                  items={cardNavItems}
                  buttonBgColor="#231F20"
                  buttonTextColor="#F7F4E1"
                  ease="power3.out"
                  {...headerProps}
                />
      </header>
    </>
  );
}
