import { useEffect, useState } from "react";
import "./App.css";
import "./darkMode.css";

function App() {
  const [word, setWord] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [font, setFont] = useState({ name: "Sans Serif", family: "Inter" });
  const [input, setInput] = useState("");

  useEffect(() => {
    async function getWord() {
      if (input) {
        const response = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${input}`
        );
        if (response.ok) {
          const data = await response.json();
          setWord(data);
        } else {
          setWord(null);
        }
      }
    }

    getWord();
  }, [input]);

  function handleSubmit(e) {
    e.preventDefault();
    const searchInput = e.target.searchInput.value;
    setInput(searchInput);
  }

  function playAudio(audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play();
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.body.classList.add("dark-mode");
    } else {
      setIsDarkMode(false);
      document.body.classList.remove("dark-mode");
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      document.body.classList.toggle("dark-mode", newMode);
      return newMode;
    });
  };

  function toggleDropdown() {
    setIsDropdownOpen((prevState) => !prevState);
  }

  function handleFontChange(fontName) {
    if (fontName === "Sans Serif") {
      setFont({ name: "Sans Serif", family: "Inter" });
    } else if (fontName === "Serif") {
      setFont({ name: "Serif", family: "Lora" });
    } else {
      setFont({ name: "Mono", family: "Inconsolata" });
    }
    setIsDropdownOpen(false);
  }

  useEffect(() => {
    document.body.style.fontFamily = font.family;
  }, [font]);

  return (
    <div className="container">
      <div className="header">
        <img src="./light-mode-icon.svg" />
        <div className="selections">
          <div className="dropdown">
            <input
              type="checkbox"
              className="dropdownCheckbox"
              checked={isDropdownOpen}
              onChange={() => setIsDropdownOpen(!isDropdownOpen)}
            />
            <label className="dropdownToggle" onClick={toggleDropdown}>
              <span className="selectedFonts">{font.name}</span>
              <img src="./font-selections-icon.svg" />
            </label>
            <ul className="dropdownMenu">
              <li
                className="dropdownItem"
                onClick={() => handleFontChange("Sans Serif")}
              >
                Sans Serif
              </li>
              <li
                className="dropdownItem"
                onClick={() => handleFontChange("Serif")}
              >
                Serif
              </li>
              <li
                className="dropdownItem"
                onClick={() => handleFontChange("Mono")}
              >
                Mono
              </li>
            </ul>
          </div>
          <div className="lightDarkModeSelection">
            <label className="switchLabel" onClick={toggleTheme}>
              <input
                type="checkbox"
                className="switch"
                checked={isDarkMode}
                onChange={toggleTheme}
              />
              <svg
                className="moonIcon"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1 10.449C0.998458 12.8283 1.80169 15.1383 3.27914 17.0033C4.75659 18.8683 6.82139 20.1788 9.13799 20.7218C11.4545 21.2647 13.8866 21.0082 16.039 19.994C18.1912 18.9797 19.9373 17.2673 20.9931 15.1352C11.5442 15.1352 6.85799 10.4479 6.85799 1C5.09842 1.87311 3.61767 3.22033 2.58266 4.88981C1.54765 6.5593 0.999502 8.48469 1 10.449Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </label>
          </div>
        </div>
      </div>
      <form className="searchForm" onSubmit={handleSubmit}>
        <input
          type="text"
          name="searchInput"
          className="searchInput"
          autoComplete="off"
          placeholder="Search for any word..."
        />
        <button>
          <img src="./iconoir_search.svg" />
        </button>
      </form>

      {word === null && input && (
        <div className="noWordMessage">
          <p className="emoji">😕</p>
          <h6>No Definitions Found</h6>
          <p className="message">
            Sorry pal, we couldn't find definitions for the word you were
            looking for. You can try the search again at later time or head to
            the web instead.
          </p>
        </div>
      )}

      {word && (
        <div className="wordDescriptionBox">
          <div className="wordPronunciation">
            <div className="wordProText">
              <h4>{word[0]?.word}</h4>
              <p>{word[0]?.phonetics[1]?.text}</p>
            </div>
            <button
              onClick={() => playAudio(word[0]?.phonetics[1]?.audio)}
              className="playButton"
            >
              <img src="./audioPlayBtn.svg" />
            </button>
          </div>
          <div className="type">
            <h3>{word[0]?.meanings[0]?.partOfSpeech}</h3>
            <span></span>
          </div>
          <h5>Meaning</h5>
          {word[0]?.meanings[0]?.definitions.map((x, index) => (
            <div key={index}>
              <p className="definition">{x.definition}</p>
              {x.example && <p className="example">"{x.example}"</p>}
            </div>
          ))}
          {word[0]?.meanings[0]?.synonyms?.length > 0 && (
            <div className="synonyms">
              <h5>Synonyms</h5>
              <p>{word[0]?.meanings[0]?.synonyms.join(", ")}</p>
            </div>
          )}
          <div className="type">
            <h3>{word[0]?.meanings[1]?.partOfSpeech}</h3>
            <span></span>
          </div>
          <h5>Meaning</h5>
          {word[0]?.meanings[1]?.definitions.map((x, index) => (
            <div key={index}>
              <div>
                <p className="definition">{x.definition}</p>
                {x.example && <p className="example">"{x.example}"</p>}
              </div>
              {x.synonyms?.length > 0 && (
                <div className="synonyms">
                  <p>Synonyms: {x.synonyms.join(", ")}</p>
                </div>
              )}
            </div>
          ))}
          <div className="sourceUrl">
            <h5>Source</h5>
            <a href={word[0]?.sourceUrls}>{word[0]?.sourceUrls}</a>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
