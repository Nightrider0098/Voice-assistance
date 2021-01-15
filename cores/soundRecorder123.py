import sounddevice as sd
from scipy.io.wavfile import write
print("executed")

freq = 44100
duration = 5


# Start recorder with the given values of 
# duration and sample frequency
print("recording started.")
recording = sd.rec(int(duration * freq), 
                   samplerate=freq, channels=2)
print("recording ended.")



# Record audio for the given number of seconds
sd.wait()


write("recording0.wav", freq, recording)

