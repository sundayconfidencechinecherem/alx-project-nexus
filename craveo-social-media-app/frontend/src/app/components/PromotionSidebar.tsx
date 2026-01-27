'use client';
import { FaPlus, FaExternalLinkAlt } from "react-icons/fa";
import Image from "next/image";

export default function PromotionSidebar() {
  const promotions = [
    {
      id: 1,
      title: "Craveo Pro",
      company: "Craveo",
      description: "Join millions of other users to start enjoying our premium subscription free for the first 6 months of use.",
      action: "Follow",
      promoted: true,
      logo: "/craveologo.png"
    },
    {
      id: 2,
      title: "Private Chef Rentals",
      company: "Private Chefs Network",
      description: "Private chefs available for home service, outdoor catering and many more. Keep up with the latest insights and resources for everyday workplace needs. Available nationwide.",
      action: "Follow",
      promoted: true
    },
    {
      id: 3,
      title: "Food Photography Masterclass",
      company: "FoodVisuals Pro",
      description: "Learn professional food styling and photography from industry experts. Boost your social media presence.",
      action: "Learn More",
      promoted: true
    }
  ];

  const trendingTopics = [
    { tag: "#FoodTok", posts: "12.5K" },
    { tag: "#HomeCooking", posts: "8.2K" },
    { tag: "#StreetFood", posts: "15.7K" },
    { tag: "#VeganRecipes", posts: "9.3K" },
    { tag: "#Baking", posts: "7.8K" }
  ];

  return (
    <div className="space-y-6">
      {/* Promotions Section */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-bold text-text-primary text-lg">Promoted Content</h3>
          <p className="text-sm text-text-secondary mt-1">Sponsored • Suggested for you</p>
        </div>
        
        <div className="divide-y divide-border">
          {promotions.map((promo) => (
            <div key={promo.id} className="p-4 hover:bg-surface-hover/50 transition-colors">
              {/* Promoted label */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-text-tertiary bg-surface-hover px-2 py-1 rounded">
                    Promoted
                  </span>
                  {promo.logo && (
                    <div className="relative w-6 h-6">
                      <Image 
                        src={promo.logo} 
                        alt={promo.company} 
                        fill 
                        className="object-contain" 
                      />
                    </div>
                  )}
                </div>
                <button className="text-text-tertiary hover:text-text-secondary">
                  <FaExternalLinkAlt className="text-sm" />
                </button>
              </div>
              
              {/* Content */}
              <div className="mb-4">
                <h4 className="font-bold text-text-primary text-lg mb-1">{promo.title}</h4>
                <p className="text-sm text-text-secondary mb-2">{promo.company}</p>
                <p className="text-text-primary text-sm leading-relaxed">{promo.description}</p>
              </div>
              
              {/* Action button */}
              <button className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-full text-sm transition-colors">
                {promo.action}
              </button>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-border">
          <button className="w-full text-primary hover:text-primary-dark text-sm font-medium flex items-center justify-center gap-1">
            Show more
            <FaPlus className="text-xs" />
          </button>
        </div>
      </div>

     

    {/* Footer Links */}
<div className="text-xs text-text-tertiary space-y-2 pt-4">
  <div className="flex flex-wrap justify-center gap-3">
    <a href="/help" className="hover:text-text-secondary hover:underline">
      Help
    </a>
    <a href="/terms" className="hover:text-text-secondary hover:underline">
      Terms
    </a>
    <a href="/privacy" className="hover:text-text-secondary hover:underline">
      Privacy
    </a>
    <a href="/cookies" className="hover:text-text-secondary hover:underline">
      Cookies
    </a>
  </div>

  <p className="pt-2 text-center">
    © 2026 Craveo. All rights reserved.
  </p>
</div>

    </div>
  );
}