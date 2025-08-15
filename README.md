# decentralized-education

To generate quizzes from video lectures, follow these steps:

Download YouTube videos as mp4:
Use https://ssyoutube.com/en803AM/ to download lecture videos.

Set up Whisper for speech-to-text extraction:
On your device, run in the terminal:

sudo apt install python3.12-venv -y

In the backend folder, run:

python3 -m venv whisper-venv
source whisper-venv/bin/activate
pip install openai-whisper

This will enable automatic transcript extraction and quiz generation for uploaded mp4 videos.
