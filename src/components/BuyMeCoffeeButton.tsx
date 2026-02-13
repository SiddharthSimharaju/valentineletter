const BuyMeCoffeeButton = () => {
  return (
    <a
      href="https://www.buymeacoffee.com/sidsimharaju"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-transform hover:scale-105"
      style={{
        backgroundColor: '#FFDD00',
        color: '#000000',
        fontFamily: "'Bree Serif', serif",
        fontSize: '14px',
        fontWeight: 600,
        textDecoration: 'none',
        border: '1px solid #000000',
      }}
    >
      <span>☕</span>
      <span>Buy me a coffee</span>
    </a>
  );
};

export default BuyMeCoffeeButton;
