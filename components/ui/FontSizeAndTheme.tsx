import { useState, useEffect } from 'react';

export default function FontSizeAndTheme() {
  const [fontSize, setFontSize] = useState('medium');
  const [theme, setTheme] = useState('default');

  useEffect(() => {
    document.body.style.fontSize = `var(--font-size-${fontSize})`;
  }, [fontSize]);

  useEffect(() => {
    document.body.className = theme === 'wheat' ? 'theme-wheat' : theme === 'light-green' ? 'theme-light-green' : '';
  }, [theme]);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span style={{ marginRight: '20px' }}>Font Size</span>
      <label style={{ marginRight: '20px' }}>
        <input
          type="radio"
          name="fontSize"
          value="small"
          checked={fontSize === 'small'}
          onChange={() => setFontSize('small')}
        />
        Small
      </label>
      <label style={{ marginRight: '20px' }}>
        <input
          type="radio"
          name="fontSize"
          value="medium"
          checked={fontSize === 'medium'}
          onChange={() => setFontSize('medium')}
        />
        Medium
      </label>
      <label style={{ marginRight: '20px' }}>
        <input
          type="radio"
          name="fontSize"
          value="large"
          checked={fontSize === 'large'}
          onChange={() => setFontSize('large')}
        />
        Large
      </label>
      <span style={{ marginLeft: '20px', marginRight: '20px' }}>Theme</span>
      <label style={{ marginRight: '20px' }}>
        <input
          type="radio"
          name="theme"
          value="default"
          checked={theme === 'default'}
          onChange={() => setTheme('default')}
        />
        White
      </label>
      <label style={{ marginRight: '20px' }}>
        <input
          type="radio"
          name="theme"
          value="wheat"
          checked={theme === 'wheat'}
          onChange={() => setTheme('wheat')}
        />
        Wheat
      </label>
      <label style={{ marginRight: '20px' }}>
        <input
          type="radio"
          name="theme"
          value="light-green"
          checked={theme === 'light-green'}
          onChange={() => setTheme('light-green')}
        />
        Light Green
      </label>
    </div>
  );
}