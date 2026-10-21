const feed = document.querySelector("#feed");
const status = document.querySelector("#status");

document.querySelector("#startCamera").addEventListener("click", () => {
  feed.src = `/video_feed?t=${Date.now()}`;
  status.textContent = "Starting webcam and YOLO tracking...";
});

document.querySelector("#stopCamera").addEventListener("click", () => {
  feed.src = "";
  status.textContent = "Video feed stopped.";
});

document.querySelector("#uploadBtn").addEventListener("click", async () => {
  const file = document.querySelector("#videoFile").files[0];
  if (!file) {
    status.textContent = "Please select a video file.";
    return;
  }
  status.textContent = "Uploading video...";
  const form = new FormData();
  form.append("video", file);
  try {
    const response = await fetch("/api/upload-video", {method:"POST", body:form});
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    feed.src = `${data.video_url}?t=${Date.now()}`;
    status.textContent = "Processing uploaded video...";
  } catch (error) {
    status.textContent = error.message;
  }
});
