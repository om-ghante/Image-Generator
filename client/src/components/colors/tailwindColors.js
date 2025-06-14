// utils/tailwindColors.js
import colors from 'tailwindcss/colors';

const validShades = ['50','100','200','300','400','500','600','700','800','900','950'];

export const allTailwindColorShades = Object.entries(colors)
  .filter(([key, value]) => typeof value === 'object') // only objects with shades
  .flatMap(([colorName, colorShades]) => {
    return validShades
      .filter(shade => colorShades[shade])
      .map(shade => ({
        name: `${colorName}-${shade}`,
        hex: colorShades[shade]
      }));
  });
