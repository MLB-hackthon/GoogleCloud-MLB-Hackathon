import React, { useState } from "react";
import "./App.css";

const PersonalizedHighlights = () => {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [frequency, setFrequency] = useState("daily");

  const handleTeamChange = (e) => setTeams([...teams, e.target.value]);
  const handlePlayerChange = (e) => setPlayers([...players, e.target.value]);
  const handleFrequencyChange = (e) => setFrequency(e.target.value);

  const handleSubmit = () => {
    console.log({ teams, players, frequency });
    alert("Preferences Saved!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-800 to-purple-600 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Personalized Highlights</h1>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <label className="block text-lg mb-2">Select Teams</label>
          <input
            type="text"
            placeholder="Search and select teams..."
            className="w-full p-3 rounded bg-gray-100 text-gray-800"
            onChange={handleTeamChange}
          />
        </div>
        <div>
          <label className="block text-lg mb-2">Select Players</label>
          <input
            type="text"
            placeholder="Search and select players..."
            className="w-full p-3 rounded bg-gray-100 text-gray-800"
            onChange={handlePlayerChange}
          />
        </div>
        <div>
          <label className="block text-lg mb-2">Digest Frequency</label>
          <select
            className="w-full p-3 rounded bg-gray-100 text-gray-800"
            value={frequency}
            onChange={handleFrequencyChange}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="after_game">After Game</option>
          </select>
        </div>
        <button
          onClick={handleSubmit}
          className="w-full p-3 bg-blue-500 hover:bg-blue-700 rounded text-white text-lg"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default PersonalizedHighlights;
