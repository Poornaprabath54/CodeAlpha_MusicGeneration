const text = document.querySelector("#text");
const source = document.querySelector("#source");
const target = document.querySelector("#target");
const result = document.querySelector("#result");
const status = document.querySelector("#status");

document.querySelector("#translateBtn").addEventListener("click", async () => {
  status.textContent = "Translating...";
  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({text:text.value, source_lang:source.value, target_lang:target.value})
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    result.textContent = data.translated_text;
    status.textContent = "Translation completed.";
  } catch (error) {
    status.textContent = error.message;
    result.textContent = "";
  }
});

document.querySelector("#copyBtn").addEventListener("click", async () => {
  await navigator.clipboard.writeText(result.textContent);
  status.textContent = "Translation copied.";
});

document.querySelector("#clearBtn").addEventListener("click", () => {
  text.value = "";
  result.textContent = "Your translated text will appear here.";
  status.textContent = "";
});
