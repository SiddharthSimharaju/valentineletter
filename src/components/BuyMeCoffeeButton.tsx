import { useEffect } from 'react';

const BuyMeCoffeeButton = () => {
  useEffect(() => {
    // Check if script already exists
    if (document.querySelector('script[data-name="bmc-button"]')) return;
    
    const script = document.createElement('script');
    script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js';
    script.setAttribute('data-name', 'bmc-button');
    script.setAttribute('data-slug', 'sidsimharaju');
    script.setAttribute('data-color', '#FFDD00');
    script.setAttribute('data-emoji', '☕');
    script.setAttribute('data-font', 'Bree');
    script.setAttribute('data-text', 'Buy me a coffee');
    script.setAttribute('data-outline-color', '#000000');
    script.setAttribute('data-font-color', '#000000');
    script.setAttribute('data-coffee-color', '#ffffff');
    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount
      const existing = document.querySelector('script[data-name="bmc-button"]');
      if (existing) existing.remove();
      const widget = document.querySelector('.bmc-btn-container');
      if (widget) widget.remove();
    };
  }, []);

  return null;
};

export default BuyMeCoffeeButton;
