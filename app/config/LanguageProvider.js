import React, { createContext, useState, useContext } from 'react';
import Color from '../common/Color';

const translations = {
  en: {
    search_placeholder: 'Search Restaurant',
    trending_restaurants: 'Trending Restaurants',
    discover_nearby: 'Discover Nearby Restaurants',
    featured_experiences: 'Featured Experiences',
    view_all: 'View All',
    tax_and_fees: 'Including Tax and Fees',
    from: 'From',
    guests: 'Guests',
    guest: 'Guest',
    search: 'Search',
    loading: 'Loading...',
    retry: 'Retry',
    error_loading: 'Failed to load restaurant list.',
    'cargo:confirm': 'Confirm',
    'inBus:selectDepDate': 'Please select a date',
    'airline:flexibleDates': 'Flexible dates',
  },
};

const LanguageContext = createContext();
export const Context = LanguageContext;

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key) => {
    return translations[language]?.[key] || key;
  };

  const colors = {
    ...Color,
    bgColorWhite: Color.white,
    bgSecondaryColor: Color.background,
    fieldBackground: Color.inputBackground,
    placeholderColor: Color.placeholderColor ?? Color.textMuted,
    headingText: Color.textPrimary,
    overlay: 'rgba(0, 0, 0, 0.5)',
    layer_color: Color.layer_color ?? Color.border,
    verticalBgColor: Color.background,
    textPrimary: Color.textPrimary,
    primaryBg: Color.headerBlue,
    fieldOpacity: Color.fieldOpacity ?? 'rgba(255, 255, 255, 0.15)',
    fieldTextColor: Color.white,
  };

  const value = {
    language,
    setLanguage,
    t,
    themeColor: { colors },
  };

  return (
    <LanguageContext.Provider value={{ ...value, value }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    // If not wrapped in provider (e.g. tests), return standard translation handler
    return {
      language: 'en',
      setLanguage: () => {},
      t: (key) => translations.en[key] || key,
    };
  }
  return context;
};
export default LanguageContext;
