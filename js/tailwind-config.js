// Tailwind theme: custom colors, fonts, shadows and animations
tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            display: ['"Space Grotesk"', '"Noto Sans Kannada"', '"Noto Sans Devanagari"', 'sans-serif'],
            sans: ['"Plus Jakarta Sans"', '"Noto Sans Kannada"', '"Noto Sans Devanagari"', 'sans-serif'],
          },
          colors: {
            saffron: { DEFAULT: '#FF6B00', hover: '#E65C00', light: '#FFF0E5' },
            peacock: { DEFAULT: '#00A896', dark: '#028090', light: '#E0F7F4' },
            indigoRoyal: { DEFAULT: '#3A0CA3', light: '#EFE9FC' },
            ink: { 950: '#0B0D13', 900: '#12151E', 800: '#1B202E', 700: '#272E40' },
            paper: { 50: '#FAF8F5', 100: '#F2EFE9', 200: '#E5E0D8' }
          },
          boxShadow: {
            'arcade': '0 4px 0 0 rgba(0, 0, 0, 0.25)',
            'arcade-saffron': '0 5px 0 0 #B84900',
            'arcade-dark': '0 4px 0 0 rgba(255, 255, 255, 0.08)',
          },
          animation: {
            'shake': 'shake 0.45s cubic-bezier(.36,.07,.19,.97) both',
            'pop': 'pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
            'pulse-fast': 'pulse 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          },
          keyframes: {
            shake: {
              '10%, 90%': { transform: 'translate3d(-2px, 0, 0)' },
              '20%, 80%': { transform: 'translate3d(4px, 0, 0)' },
              '30%, 50%, 70%': { transform: 'translate3d(-6px, 0, 0)' },
              '40%, 60%': { transform: 'translate3d(6px, 0, 0)' }
            },
            pop: {
              '0%': { transform: 'scale(0.95)', opacity: '0.7' },
              '70%': { transform: 'scale(1.02)' },
              '100%': { transform: 'scale(1)', opacity: '1' }
            }
          }
        }
      }
    }
  