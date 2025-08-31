# from tkinter import *
# import time

# root = Tk()
# root.title("PC Load Demo")
# root.geometry("300x100")

# label = Label(root, text="Generating Load...")
# label.pack(pady=20)

# def generate_load():
#     start = time.time()
#     while time.time() - start < 10:
#         sum([i*i for i in range(10000)])
#     label.config(text="Load Test Complete!")

# Button(root, text="Start Test", command=generate_load).pack()
# root.mainloop()





# import time

# def slow_demo(duration=15):
#     print("Starting slow demo... low-config PCs will lag.")
#     end = time.time() + duration
#     data = []
#     while time.time() < end:
#         # CPU intensive task
#         sum(i*i for i in range(10000))
#         # Simulate memory usage
#         data.append([j*j for j in range(5000)])
#     print("Demo finished safely!")

# slow_demo()




import threading

def cpu_task():
    while True:
        sum(i*i for i in range(10000))

threads = []
for _ in range(4):  # Number of threads, reduce if too high
    t = threading.Thread(target=cpu_task)
    t.start()
    threads.append(t)


