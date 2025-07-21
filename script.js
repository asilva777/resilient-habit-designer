// script.js for Resilient Habit Designer

document.addEventListener('DOMContentLoaded', function () {
  const habitForm = document.getElementById('habit-form');
  const recommendationList = document.getElementById('recommendation-list');
  const downloadBtn = document.getElementById('download-btn');
  const tryAgainBtn = document.getElementById('try-again-btn');
  const feedback = document.getElementById('feedback');
  const recommendationSection = document.getElementById('recommendation-section');

  function showFeedback(message, isError = false) {
    feedback.textContent = message;
    feedback.hidden = false;
    feedback.style.color = isError ? 'red' : 'green';
    setTimeout(() => {
      feedback.hidden = true;
    }, 4000);
  }

  function clearRecommendation() {
    recommendationList.innerHTML = '';
    recommendationSection.innerHTML = '<h2 id="recommendation-title">Recommended Habits</h2>';
  }

  function getFormData() {
    const formData = new FormData(habitForm);
    return {
      context: formData.get('context') || '',
      habit: formData.get('habit-description') || '',
      goal: formData.get('tiny-goal') || '',
      motivation: formData.get('motivation') || '',
      prompt: formData.get('prompt') || '',
      ease: formData.get('ease') || '',
      reward: formData.get('reward') || ''
    };
  }

  function generateRecommendation(data) {
    return [
      `**Context:** ${data.context}`,
      `**Habit:** ${data.habit}`,
      `**Tiny Goal:** ${data.goal}`,
      `**Motivation Level:** ${data.motivation}`,
      `**Prompt/Trigger:** ${data.prompt}`,
      `**Ease:** ${data.ease}`,
      `**Celebration/Reward:** ${data.reward}`,
      `\n🎯 _Remember: Start small, celebrate, and iterate for long-term success!_`
    ];
  }

  function displayRecommendation(recommendation) {
    recommendationList.innerHTML = '';
    recommendation.forEach(line => {
      const li = document.createElement('li');
      li.innerHTML = line;
      recommendationList.appendChild(li);
    });

    // Also update the recommendation section for accessibility/flexibility
    recommendationSection.innerHTML = `<h2 id="recommendation-title">Recommended Habits</h2><ul>${recommendation.map(line => `<li>${line}</li>`).join('')}</ul>`;
  }

  habitForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Validate all required fields using HTML5 validation
    if (!habitForm.checkValidity()) {
      showFeedback('Please fill out all required fields.', true);
      return;
    }

    const data = getFormData();
    const recommendation = generateRecommendation(data);

    displayRecommendation(recommendation);
    showFeedback('Recommendation generated successfully.');

    // Scroll to recommendation for better UX
    recommendationSection.scrollIntoView({ behavior: 'smooth' });
  });

  downloadBtn.addEventListener('click', function () {
    const data = getFormData();
    if (!data.habit || !data.goal || !data.prompt || !data.ease || !data.reward) {
      showFeedback('Fill in the form and get a recommendation first.', true);
      return;
    }

    const lines = generateRecommendation(data).map(line => line.replace(/\*\*/g, ''));
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'resilient-habit-plan.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    showFeedback('Habit plan downloaded.');
  });

  tryAgainBtn.addEventListener('click', function () {
    habitForm.reset();
    clearRecommendation();
    showFeedback('Form reset. Design a new habit!');
    habitForm.scrollIntoView({ behavior: 'smooth' });
  });

  // Accessibility: focus first input on load
  const firstInput = habitForm.querySelector('input, select, textarea');
  if (firstInput) firstInput.focus();
});
