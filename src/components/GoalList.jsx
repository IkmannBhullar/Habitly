import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const GoalList = () => {
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem("goals");
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");

  const totalCreated = goals.length;
  const totalCompleted = goals.filter((g) => g.completed).length;
  const completionRate =
    totalCreated > 0
      ? Math.round((totalCompleted / totalCreated) * 100)
      : 0;

  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  const getStreakData = () => {
    const log = JSON.parse(localStorage.getItem("goalLog") || "[]");

    if (log.length === 0) return { current: 0, longest: 0, lastActive: "N/A" };

    const dateSet = new Set(log.map((entry) => entry.date));
    const sortedDates = Array.from(dateSet).sort(); // YYYY-MM-DD

    let currentStreak = 1;
    let longestStreak = 1;
    let lastActive = sortedDates[sortedDates.length - 1];

    for (let i = sortedDates.length - 2; i >= 0; i--) {
      const current = new Date(sortedDates[i]);
      const next = new Date(sortedDates[i + 1]);
      const diff = (next - current) / (1000 * 60 * 60 * 24);

      if (diff === 1) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        if (i === sortedDates.length - 2) {
          currentStreak = diff === 0 ? 1 : 0;
        } else {
          break;
        }
      }
    }

    return {
      current: currentStreak,
      longest: longestStreak,
      lastActive,
    };
  };

  const { current, longest, lastActive } = getStreakData();

  const addGoal = () => {
    if (input.trim() === "") return;
    const newGoal = {
      id: Date.now(),
      text: input,
      completed: false,
    };
    setGoals([newGoal, ...goals]);
    setInput("");
  };

  const toggleComplete = (id) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    );
    setGoals(updatedGoals);

    const justCompleted = updatedGoals.find(
      (goal) => goal.id === id && goal.completed
    );
    if (justCompleted) {
      const log = JSON.parse(localStorage.getItem("goalLog") || "[]");
      const today = new Date().toISOString().split("T")[0];

      // Prevent duplicate logs for the same day
      const alreadyLoggedToday = log.some((entry) => entry.date === today);
      if (!alreadyLoggedToday) {
        log.push({ id: Date.now(), date: today });
        localStorage.setItem("goalLog", JSON.stringify(log));

        // After logging, check if longest streak increased
        const updatedStreak = getStreakData();
        const previousLongest = longest;
        if (updatedStreak.longest > previousLongest) {
          toast.success("🔥 New longest streak!");
        }
      }
    }
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter((goal) => goal.id !== id));
  };

  const exportCSV = () => {
    const log = JSON.parse(localStorage.getItem("goalLog") || "[]");
    const header = "ID,Date\n";
    const rows = log.map((entry) => `${entry.id},${entry.date}`).join("\n");
    const csvContent = header + rows;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "goal-log.csv";
    link.click();
  };

  return (
    <div className="goal-list">
      <h2>📝 Daily Goals</h2>

      <div className="goal-stats">
        <p>🧮 Total Goals: {totalCreated}</p>
        <p>✅ Completed: {totalCompleted}</p>
        <p>📈 Completion Rate: {completionRate}%</p>
      </div>

      <div className="streak-stats">
        <h3>🔥 Streaks</h3>
        <p>🔥 Current Streak: {current} day(s)</p>
        <p>🏆 Longest Streak: {longest} day(s)</p>
        <p>📅 Last Active: {lastActive}</p>
        <button onClick={exportCSV}>📤 Export CSV</button>
      </div>

      <div className="input-group">
        <input
          type="text"
          placeholder="Enter your goal..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={addGoal}>Add</button>
      </div>

      <ul>
        {goals.map((goal) => (
          <li key={goal.id} className={goal.completed ? "completed" : ""}>
            <span onClick={() => toggleComplete(goal.id)}>{goal.text}</span>
            <button onClick={() => deleteGoal(goal.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GoalList;
