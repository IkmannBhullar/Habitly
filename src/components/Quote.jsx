import { useEffect, useState } from "react";
import toast from "react-hot-toast"; // Import toast

const Quote = () => {
  const [quote, setQuote] = useState({ q: "", a: "" });
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favoriteQuotes");
    return saved ? JSON.parse(saved) : [];
  });

  const fetchQuote = async () => {
    try {
      const res = await fetch("https://api.quotable.io/random");
      const data = await res.json();

      console.log("Fetched quote:", data); // DEBUG

      setQuote({
        q: data.content,
        a: data.author,
      });
    } catch (err) {
      console.error("Failed to fetch quote:", err);
      setQuote({
        q: "Stay strong. This is just a phase.",
        a: "Unknown",
      });
    }
  };

  const saveToFavorites = () => {
    const isAlreadySaved = favorites.some(
      (f) => f.q === quote.q && f.a === quote.a
    );
    if (isAlreadySaved) {
      toast.error("This quote is already saved.");
      return;
    }
  
    const updated = [quote, ...favorites];
    setFavorites(updated);
    localStorage.setItem("favoriteQuotes", JSON.stringify(updated));
    toast.success("Quote saved to favorites!");
  };
  
  useEffect(() => {
    fetchQuote();
  }, []);

  const deleteFavorite = (index) => {
    const updated = favorites.filter((_, i) => i !== index);
    setFavorites(updated);
    localStorage.setItem("favoriteQuotes", JSON.stringify(updated));
    toast("Quote removed from favorites.", {
      icon: "🗑️",
    });
  };
  
  return (
    <div className="quote-box">
      <blockquote>“{quote.q}”</blockquote>
      <p className="author">— {quote.a}</p>

      <div className="quote-buttons">
        <button onClick={fetchQuote}>🔁 New Quote</button>
        <button onClick={saveToFavorites}>❤️ Save</button>
      </div>

      {favorites.length > 0 && (
        <div className="favorites">
          <h4>⭐ Favorite Quotes</h4>
          <ul>
            {favorites.map((fav, i) => (
              <li key={i} className="favorite-item">
      <div>
        “{fav.q}” — <em>{fav.a}</em>
      </div>
      <button onClick={() => deleteFavorite(i)}>🗑️</button>
    </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Quote;
