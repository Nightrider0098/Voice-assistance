import speech_recognition as sr
import sys
r = sr.Recognizer()

with sr.AudioFile(sys.argv[1]) as source:
    audio = r.record(source)
    MyText = r.recognize_google(audio)
print(MyText.lower())
