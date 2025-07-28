import sys
import whisper
import os

# Usage: python extract_transcript.py /path/to/video.mp4 /path/to/output.txt

def main():
    if len(sys.argv) < 3:
        print("Usage: python extract_transcript.py <video_path> <output_path>")
        sys.exit(1)
    video_path = sys.argv[1]
    output_path = sys.argv[2]
    if not os.path.exists(video_path):
        print(f"Video file not found: {video_path}")
        sys.exit(1)
    model = whisper.load_model("small")  # You can use "base", "small", "medium", "large"
    result = model.transcribe(video_path)
    transcript = result["text"]
    with open(output_path, "w") as f:
        f.write(transcript)
    print(transcript)  # Print transcript to stdout for backend integration
    print(f"Transcript saved to {output_path}")

if __name__ == "__main__":
    main()
