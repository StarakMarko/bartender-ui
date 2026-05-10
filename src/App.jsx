import { useState, useEffect } from 'react';
import { Droplets, Loader2, CheckCircle2, AlertCircle, Menu, Dices, Save, Trash2 } from 'lucide-react';
import { saveRecipe, subscribeToRobotStatus } from './firebase';
import { PREDEFINED_COCKTAILS, INGREDIENTS } from './cocktailsData';
import './index.css';

function App() {
  const [selectedGlass, setSelectedGlass] = useState(1);
  const [mode, setMode] = useState('predefined'); // 'predefined' | 'custom'
  
  const [customRecipe, setCustomRecipe] = useState({
    pump1: 0,
    pump2: 0,
    pump3: 0,
    pump4: 0
  });
  
  const [selectedPredefined, setSelectedPredefined] = useState(null);
  
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [toastMessage, setToastMessage] = useState('');
  const [glassStatuses, setGlassStatuses] = useState({ 1: false, 2: false, 3: false, 4: false, 5: false });
  const [predefinedVolume, setPredefinedVolume] = useState(200);
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);
  
  const [savedCocktails, setSavedCocktails] = useState(() => {
    const saved = localStorage.getItem('savedCocktails');
    return saved ? JSON.parse(saved) : [];
  });
  const [customCocktailName, setCustomCocktailName] = useState('');
  const [isRandomizing, setIsRandomizing] = useState(false);

  const allCocktails = [...PREDEFINED_COCKTAILS, ...savedCocktails];

  // Clear toast after 3 seconds
  useEffect(() => {
    if (status === 'success' || status === 'error') {
      const timer = setTimeout(() => setStatus('idle'), 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  useEffect(() => {
    const unsubscribe = subscribeToRobotStatus((statuses) => {
      setGlassStatuses(statuses);
    });
    return () => unsubscribe();
  }, []);

  const handlePumpChange = (pump, value) => {
    setCustomRecipe(prev => ({
      ...prev,
      [pump]: parseInt(value, 10)
    }));
  };

  const handleRandomCocktail = () => {
    if (isRandomizing || allCocktails.length === 0) return;
    setIsRandomizing(true);
    setMode('predefined');
    
    let counter = 0;
    const maxShuffles = 15;
    let delay = 50; // initial fast delay
    
    const shuffle = () => {
      const randomIndex = Math.floor(Math.random() * allCocktails.length);
      setSelectedPredefined(allCocktails[randomIndex].id);
      counter++;
      
      if (counter < maxShuffles) {
        delay += 20; // gradually slow down
        setTimeout(shuffle, delay);
      } else {
        setIsRandomizing(false);
      }
    };
    
    shuffle();
  };

  const handleSaveCustomRecipe = () => {
    if (!customCocktailName.trim()) {
      setToastMessage('Enter cocktail name');
      setStatus('error');
      return;
    }
    const totalVolume = Object.values(customRecipe).reduce((a, b) => a + b, 0);
    if (totalVolume === 0) {
      setToastMessage('Recipe cannot be empty');
      setStatus('error');
      return;
    }
    
    const newCocktail = {
      id: 'custom_' + Date.now(),
      name: customCocktailName.trim(),
      recipe: { ...customRecipe }
    };
    
    const newSavedList = [...savedCocktails, newCocktail];
    setSavedCocktails(newSavedList);
    localStorage.setItem('savedCocktails', JSON.stringify(newSavedList));
    
    setToastMessage('Recipe saved!');
    setStatus('success');
    setCustomCocktailName('');
    setSelectedPredefined(newCocktail.id);
    setMode('predefined');
  };

  const handleMakeCocktail = async () => {
    let finalRecipe;
    
    if (mode === 'predefined') {
      if (!selectedPredefined) {
        setToastMessage('Please select a cocktail');
        setStatus('error');
        return;
      }
      const cocktail = allCocktails.find(c => c.id === selectedPredefined);
      
      const baseRecipe = cocktail.recipe;
      const baseTotal = Object.values(baseRecipe).reduce((a, b) => a + b, 0);
      
      finalRecipe = {
        pump1: Math.round((baseRecipe.pump1 / baseTotal) * predefinedVolume) || 0,
        pump2: Math.round((baseRecipe.pump2 / baseTotal) * predefinedVolume) || 0,
        pump3: Math.round((baseRecipe.pump3 / baseTotal) * predefinedVolume) || 0,
        pump4: Math.round((baseRecipe.pump4 / baseTotal) * predefinedVolume) || 0,
      };
    } else {
      // Check if custom recipe is all 0
      const totalVolume = Object.values(customRecipe).reduce((a, b) => a + b, 0);
      if (totalVolume === 0) {
        setToastMessage('Recipe cannot be empty');
        setStatus('error');
        return;
      }
      finalRecipe = customRecipe;
    }

    setStatus('loading');
    
    try {
      await saveRecipe(selectedGlass, finalRecipe);
      setToastMessage(`Cocktail is being prepared in glass ${selectedGlass}!`);
      setStatus('success');
      
      // Reset selections if needed
      if (mode === 'custom') {
        setCustomRecipe({ pump1: 0, pump2: 0, pump3: 0, pump4: 0 });
      }
    } catch (error) {
      console.error(error);
      setToastMessage('Error connecting to robot');
      setStatus('error');
    }
  };

  return (
    <div className="app-container">
      <h1>Cyber Bartender</h1>
      <p className="subtitle">Select glass and cocktail for preparation</p>

      <div className="glass-panel">
        {/* Glass Selection */}
        <div className="glasses-container circular">
          {[1, 2, 3, 4, 5].map((num, index) => {
            const angle = (-126 - index * 72) * (Math.PI / 180);
            const radius = 100; // px
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const isWorking = glassStatuses[num];

            return (
              <div
                key={num}
                className={`glass-circle ${selectedGlass === num ? 'active' : ''} ${isWorking ? 'working' : 'ready'}`}
                style={{
                  '--x': `${x}px`,
                  '--y': `${y}px`
                }}
                onClick={() => setSelectedGlass(num)}
              >
                <span>{num}</span>
              </div>
            );
          })}
          
          <div className="center-glass-info">
             <div className="status-dot" style={{ backgroundColor: glassStatuses[selectedGlass] ? '#eab308' : '#22c55e' }}></div>
             <span>{glassStatuses[selectedGlass] ? 'In progress' : 'Ready'}</span>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="tabs">
          <button 
            className={`tab-btn ${mode === 'predefined' ? 'active' : ''}`}
            onClick={() => setMode('predefined')}
          >
            Cocktails
          </button>
          <button 
            className={`tab-btn ${mode === 'custom' ? 'active' : ''}`}
            onClick={() => setMode('custom')}
          >
            Custom recipe
          </button>
          <button 
            className="tab-btn"
            onClick={handleRandomCocktail}
            disabled={isRandomizing}
            style={{ 
              flex: 0.3, 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              opacity: isRandomizing ? 0.5 : 1,
              cursor: isRandomizing ? 'not-allowed' : 'pointer'
            }}
            title="Random cocktail"
          >
            <Dices size={20} className={isRandomizing ? 'spinner' : ''} />
          </button>
        </div>

        {/* Content based on mode */}
        {mode === 'predefined' ? (
          <div className="predefined-section">
            <div className="cocktail-grid">
              {allCocktails.map(cocktail => {
                const Icon = cocktail.icon || Droplets;
                const isExpanded = expandedRecipeId === cocktail.id;
                const isCustom = cocktail.id.startsWith('custom_');
                
                return (
                  <div 
                    key={cocktail.id}
                    className={`cocktail-card ${selectedPredefined === cocktail.id ? (isRandomizing ? 'random-highlight' : 'selected') : ''}`}
                    onClick={() => setSelectedPredefined(cocktail.id)}
                  >
                    {isCustom && (
                      <div 
                        className="cocktail-delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newList = savedCocktails.filter(c => c.id !== cocktail.id);
                          setSavedCocktails(newList);
                          localStorage.setItem('savedCocktails', JSON.stringify(newList));
                          if (selectedPredefined === cocktail.id) {
                            setSelectedPredefined(null);
                          }
                        }}
                        title="Delete recipe"
                      >
                        <Trash2 size={16} />
                      </div>
                    )}
                    <div 
                      className="cocktail-info-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedRecipeId(isExpanded ? null : cocktail.id);
                      }}
                    >
                      <Menu size={18} />
                    </div>
                    <Icon className="cocktail-icon" size={32} />
                    <div className="cocktail-name">{cocktail.name}</div>
                    
                    {isExpanded && (
                      <div className="cocktail-recipe-details">
                        <div className="recipe-title">Ingredients:</div>
                        {Object.entries(cocktail.recipe).map(([pump, value]) => {
                          if (value > 0) {
                            const num = pump.replace('pump', '');
                            return <div key={pump}>{num}. {INGREDIENTS[pump]}: {value} ml</div>;
                          }
                          return null;
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {selectedPredefined && (
              <div className="pump-card" style={{ marginBottom: '2rem' }}>
                <div className="pump-header">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Droplets size={20} color="var(--primary)" />
                    Total cocktail volume
                  </span>
                  <span className="pump-value">{predefinedVolume} ml</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="500" 
                  step="50"
                  value={predefinedVolume}
                  onChange={(e) => setPredefinedVolume(parseInt(e.target.value, 10))}
                  className="pump-slider"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="custom-recipe-section">
            <div className="pump-grid">
              {[1, 2, 3, 4].map(num => {
                const pumpKey = `pump${num}`;
                return (
                  <div key={num} className="pump-card">
                    <div className="pump-header">
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Droplets size={20} color="var(--primary)" />
                        {num}. {INGREDIENTS[pumpKey]}
                      </span>
                      <span className="pump-value">{customRecipe[pumpKey]} ml</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="300" 
                      step="10"
                      value={customRecipe[pumpKey]}
                      onChange={(e) => handlePumpChange(pumpKey, e.target.value)}
                      className="pump-slider"
                    />
                  </div>
                );
              })}
            </div>
            
            <div className="pump-card" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
               <input 
                 type="text" 
                 value={customCocktailName}
                 onChange={e => setCustomCocktailName(e.target.value)}
                 placeholder="Your mix name"
                 style={{ flex: 1, minWidth: '200px', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--panel-border)', background: 'rgba(0,0,0,0.2)', color: 'white', fontFamily: 'inherit' }}
               />
               <button 
                 onClick={handleSaveCustomRecipe}
                 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: '600', transition: 'var(--transition)' }}
                 onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                 onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
               >
                 <Save size={20} />
                 Save recipe
               </button>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button 
          className="action-btn"
          onClick={handleMakeCocktail}
          disabled={status === 'loading' || isRandomizing}
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="spinner" size={24} />
              Sending...
            </>
          ) : (
            'Pour cocktail'
          )}
        </button>
      </div>

      {/* Toast Notification */}
      {(status === 'success' || status === 'error') && (
        <div className={`toast ${status === 'error' ? 'error' : ''}`}>
          {status === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default App;
