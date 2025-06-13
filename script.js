// Behavior Design Steps
const steps = [
  {
    title: "Step 1: What do you want to focus on?",
    content: `<label for="habit">Area of Focus:</label>
              <input id="habit" placeholder="e.g., Daily gratitude, Better sleep" aria-required="true" required autofocus />`
  },
  {
    title: "Step 2: What's your motivation?",
    content: `<label for="motivation">Why does this matter to you?</label>
              <textarea id="motivation" required></textarea>`
  },
  {
    title: "Step 3: Define the behavior",
    content: `<label for="behavior">What small behavior will you do?</label>
              <input id="behavior" placeholder="e.g., Write 3 things I'm grateful for each night" required />`
  },
  {
    title: "Step 4: Design the prompt",
    content: `<label for="prompt">When or where will this happen?</label>
              <input id="prompt" placeholder="e.g., After brushing my teeth" required />`
  },
  {
    title: "Step 5: Choose a celebration",
    content: `<label for="celebration">How will you celebrate immediately?</label>
              <input id="celebration" placeholder="e.g., Say 'Yes!' or smile at myself in the mirror" required />`
  },
  {
    title: "Step 6: Frequency & Flexibility",
    content: `<label for="frequency">How often will you do this?</label>
              <select id="frequency" required>
                <option value="">Select</option>
                <option value="Daily">Daily</option>
                <option value="3x/Week">3x/Week</option>
                <option value="Weekends">Weekends</option>
                <option value="Custom">Custom</option>
              </select>`
  },
  {
    title: "Step 7: Ability Assessment - Time",
    content: `<label for="time">How much time will it take? (1=Very short, 5=Very long)</label>
              <input id="time" type="number" min="1" max="5" required />`
  },
  {
    title: "Step 8: Ability Assessment - Mental Effort",
    content: `<label for="mental">How mentally demanding is it? (1=Easy, 5=Hard)</label>
              <input id="mental" type="number" min="1" max="5" required />`
  },
  {
    title: "Step 9: Ability Assessment - Money",
    content: `<label for="money">Does it cost money? (1=No, 5=Expensive)</label>
              <input id="money" type="number" min="1" max="5" required />`
  },
  {
    title: "Step 10: Ability Assessment - Physical Effort",
    content: `<label for="physical">How physically demanding is it? (1=Easy, 5=Hard)</label>
              <input id="physical" type="number" min="1" max="5" required />`
  },
  {
    title: "Step 11: Ability Assessment - Routine Compatibility",
    content: `<label for="routine">How well does it fit your routine? (1=Not well, 5=Perfect fit)</label>
              <input id="routine" type="number" min="1" max="5" required />`
  }
];

// DOM Elements
let currentStep = 0;
const container = document.getElementById("stepContainer");
const result = document.getElementById("result");
const recommendation = document.getElementById("recommendation");
const neuroInsights = document.getElementById("neuroInsights");
const takeaway = document.getElementById("takeaway");
const tryAgainContainer = document.getElementById("tryAgainContainer");
const downloadContainer = document.getElementById("downloadContainer");
const progressBar = document.getElementById("progressBar");

// Render the progress bar
function renderProgressBar() {
  progressBar.innerHTML = '';
  steps.forEach((_, idx) => {
    const li = document.createElement('li');
    li.classList.toggle('active', idx <= currentStep);
    progressBar.appendChild(li);
  });
}

// Render a step
function renderStep() {
  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;
  container.innerHTML = `
    <h2>${step.title}</h2>
    <form id="stepForm" novalidate>
      ${step.content}
      <div class="buttons">
        ${currentStep > 0 ? '<button type="button" id="backBtn">Back</button>' : '<span></span>'}
        <button type="submit" id="nextBtn">${isLast ? 'Design My Habit' : 'Next Step'}</button>
      </div>
      <div id="errorMsg" class="error-message" aria-live="assertive"></div>
    </form>
  `;
  renderProgressBar();
  document.getElementById("stepForm").onsubmit = function(e) {
    e.preventDefault();
    handleStepSubmission();
  };
  if (currentStep > 0) {
    document.getElementById("backBtn").onclick = prevStep;
  }
}

// Validate inputs for current step
function handleStepSubmission() {
  const input = container.querySelector('input, textarea, select');
  const errorMsg = document.getElementById("errorMsg");
  if (input && !input.value) {
    errorMsg.textContent = "This field is required.";
    input.focus();
    return;
  }
  if (input && input.type === "number") {
    const val = parseInt(input.value, 10);
    if (val < parseInt(input.min) || val > parseInt(input.max)) {
      errorMsg.textContent = `Value must be between ${input.min} and ${input.max}.`;
      input.focus();
      return;
    }
  }
  errorMsg.textContent = "";
  if (currentStep === steps.length - 1) {
    handleFinalStep();
  } else {
    nextStep();
  }
}

// Go to next step
function nextStep() {
  currentStep++;
  renderStep();
}

// Go to previous step
function prevStep() {
  currentStep--;
  renderStep();
}

// Generate output summary
function handleFinalStep() {
  // Collect all values
  const ids = ["habit", "motivation", "behavior", "prompt", "celebration", "frequency", "time", "mental", "money", "physical", "routine"];
  const values = {};
  let missing = false;
  ids.forEach(id => {
    const el = document.getElementById(id);
    values[id] = el ? el.value : '';
    if (!values[id]) {
      missing = true;
    }
  });
  if (missing) {
    alert("Please complete all form fields.");
    return;
  }
  // Output summary with input sanitization
  const output = [
    "MY HABIT DESIGN",
    `Need Focus: ${values.habit}`,
    `Motivation: ${values.motivation}`,
    `Behavior: ${values.behavior}`,
    `Prompt: ${values.prompt}`,
    `Celebration: ${values.celebration}`,
    `Frequency: ${values.frequency}`,
    "",
    "Ability Assessment (lower is better):",
    `- Time: ${values.time}`,
    `- Mental: ${values.mental}`,
    `- Money: ${values.money}`,
    `- Physical: ${values.physical}`,
    `Routine Compatibility: ${values.routine}`
  ].join('\n');

  // Recommendation logic
  const abilityTotal = ["time", "mental", "money", "physical"].reduce((sum, key) => sum + parseInt(values[key], 10), 0);
  const compatible = parseInt(values.routine, 10);
  const recommendationText =
    abilityTotal <= 8 && compatible >= 4
      ? "✅ This habit looks resilient and aligned. Move forward with confidence."
      : "⚠️ Consider iterating this habit. Lower time, cost, or effort, or increase routine alignment.";

  neuroInsights.classList.remove("hidden");
  result.classList.remove("hidden");
  result.innerText = output;
  recommendation.classList.remove("hidden");
  recommendation.innerText = recommendationText;
  takeaway.classList.remove("hidden");
  tryAgainContainer.classList.remove("hidden");
  downloadContainer.classList.remove("hidden");
  progressBar.innerHTML = '';
}

// Restart
function restartDesigner() {
  currentStep = 0;
  neuroInsights.classList.add("hidden");
  result.classList.add("hidden");
  recommendation.classList.add("hidden");
  takeaway.classList.add("hidden");
  tryAgainContainer.classList.add("hidden");
  downloadContainer.classList.add("hidden");
  renderStep();
}

// Download summary
function downloadSummary() {
  const summary = result.innerText;
  const blob = new Blob([summary], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'Resilient_Habit_Design.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  renderStep();
});
