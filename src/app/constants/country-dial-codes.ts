/** Country name and dial code for phone number inputs. dialCode includes the + prefix. */
export interface CountryDialCode {
    name: string;
    dialCode: string;
    /** Display in dropdown: e.g. "Canada (+1)" */
    label: string;
}

function entry(name: string, dialCode: string): CountryDialCode {
    return { name, dialCode, label: `${name} (${dialCode})` };
}

/** Common country dial codes. Canada and US first for +1. */
export const COUNTRY_DIAL_CODES: CountryDialCode[] = [
    entry('Canada', '+1'),
    entry('United States', '+1'),
    entry('United Kingdom', '+44'),
    entry('India', '+91'),
    entry('Australia', '+61'),
    entry('China', '+86'),
    entry('Japan', '+81'),
    entry('Germany', '+49'),
    entry('France', '+33'),
    entry('Mexico', '+52'),
    entry('Brazil', '+55'),
    entry('Spain', '+34'),
    entry('Italy', '+39'),
    entry('Netherlands', '+31'),
    entry('South Korea', '+82'),
    entry('Pakistan', '+92'),
    entry('Bangladesh', '+880'),
    entry('Nigeria', '+234'),
    entry('South Africa', '+27'),
    entry('Philippines', '+63'),
    entry('Vietnam', '+84'),
    entry('Indonesia', '+62'),
    entry('Turkey', '+90'),
    entry('Poland', '+48'),
    entry('Ireland', '+353'),
    entry('New Zealand', '+64'),
    entry('Argentina', '+54'),
    entry('Colombia', '+57'),
    entry('Chile', '+56'),
    entry('Egypt', '+20'),
    entry('Saudi Arabia', '+966'),
    entry('United Arab Emirates', '+971'),
    entry('Israel', '+972'),
    entry('Singapore', '+65'),
    entry('Malaysia', '+60'),
    entry('Thailand', '+66'),
    entry('Hong Kong', '+852'),
    entry('Portugal', '+351'),
    entry('Greece', '+30'),
    entry('Czech Republic', '+420'),
    entry('Romania', '+40'),
    entry('Hungary', '+36'),
    entry('Sweden', '+46'),
    entry('Norway', '+47'),
    entry('Denmark', '+45'),
    entry('Finland', '+358'),
    entry('Belgium', '+32'),
    entry('Austria', '+43'),
    entry('Switzerland', '+41'),
    entry('Russia', '+7'),
];
