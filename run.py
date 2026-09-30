import os
import sys
import time
import shutil
import signal
import socket
import webbrowser
import subprocess
from pathlib import Path

def find_project_dirs():
    current_dir = Path(__file__).resolve().parent
    
    # Check if backend and frontend are directly in current_dir
    if (current_dir / "backend").exists() and (current_dir / "frontend").exists():
        return current_dir / "backend", current_dir / "frontend"
    
    # Check if in "Job connect" subfolder
    job_connect_sub = current_dir / "Job connect"
    if (job_connect_sub / "backend").exists() and (job_connect_sub / "frontend").exists():
        return job_connect_sub / "backend", job_connect_sub / "frontend"
    
    # Check parent folder
    parent_dir = current_dir.parent
    if (parent_dir / "backend").exists() and (parent_dir / "frontend").exists():
        return parent_dir / "backend", parent_dir / "frontend"

    return None, None

def find_executable(name, extra_paths=None):
    # First try standard PATH
    exe_path = shutil.which(name)
    if exe_path:
        return exe_path
    
    # Try extra common paths on Windows
    if extra_paths:
        for p in extra_paths:
            expanded = os.path.expandvars(os.path.expanduser(p))
            if os.path.isfile(expanded) and os.access(expanded, os.X_OK):
                return expanded
            if os.path.isfile(expanded + ".exe"):
                return expanded + ".exe"
    return None

def is_port_in_use(port, host='127.0.0.1'):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(1)
        return s.connect_ex((host, port)) == 0

def main():
    print("=" * 60)
    print("       🚀 Starting Job Connect Full Stack Platform 🚀      ")
    print("=" * 60)

    backend_dir, frontend_dir = find_project_dirs()

    if not backend_dir or not frontend_dir:
        print("[ERROR] Could not locate backend and frontend folders!")
        print(f"Searched around: {Path(__file__).resolve().parent}")
        input("Press Enter to exit...")
        sys.exit(1)

    print(f"[*] Backend path:  {backend_dir}")
    print(f"[*] Frontend path: {frontend_dir}")

    # Find PHP executable
    php_extra_paths = [
        "~/.config/herd-lite/bin/php.exe",
        r"C:\Users\saifs\.config\herd-lite\bin\php.exe",
        r"C:\php\php.exe",
        r"C:\tools\php\php.exe",
        r"C:\xampp\php\php.exe",
        r"C:\laragon\bin\php\current\php.exe",
        r"C:\Users\hmsra\php\php.exe",
    ]
    php_bin = find_executable("php", php_extra_paths) or "php"

    # Find NPM executable
    npm_extra_paths = [
        r"C:\Program Files\nodejs\npm.cmd",
        r"C:\Program Files (x86)\nodejs\npm.cmd",
        r"~\AppData\Roaming\npm\npm.cmd",
    ]
    npm_bin = find_executable("npm", npm_extra_paths) or "npm"

    processes = []

    try:
        # Start Backend
        print("\n[1/2] ⚙️  Starting Backend (Laravel on http://127.0.0.1:8000)...")
        backend_cmd = [php_bin, "artisan", "serve", "--host=127.0.0.1", "--port=8000"]
        backend_proc = subprocess.Popen(
            backend_cmd,
            cwd=str(backend_dir),
            shell=(sys.platform == "win32")
        )
        processes.append(backend_proc)

        # Start Frontend
        print("[2/2] ⚡ Starting Frontend (Vite on http://localhost:5173)...")
        frontend_cmd = [npm_bin, "run", "dev"]
        frontend_proc = subprocess.Popen(
            frontend_cmd,
            cwd=str(frontend_dir),
            shell=(sys.platform == "win32")
        )
        processes.append(frontend_proc)

        print("\n" + "=" * 60)
        print(" ✅ Job Connect is running successfully!")
        print(" 🌐 Frontend: http://localhost:5173")
        print(" 🔌 Backend:  http://127.0.0.1:8000")
        print("=" * 60)
        print(" [i] Opening browser in 3 seconds...")
        print(" [i] Press Ctrl + C to stop all servers.")
        print("=" * 60 + "\n")

        # Give servers a moment to initialize before opening the browser
        time.sleep(3)
        webbrowser.open("http://localhost:5173")

        # Keep running and monitor processes
        while True:
            time.sleep(1)
            for proc in processes:
                if proc.poll() is not None:
                    # One of the processes terminated
                    print(f"\n[WARNING] Process PID {proc.pid} exited with code {proc.returncode}.")

    except KeyboardInterrupt:
        print("\n\n🛑 Stopping Job Connect servers...")
    finally:
        for proc in processes:
            try:
                if sys.platform == "win32":
                    subprocess.call(['taskkill', '/F', '/T', '/PID', str(proc.pid)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                else:
                    proc.terminate()
            except Exception:
                pass
        print("👋 All servers stopped. Goodbye!\n")

if __name__ == "__main__":
    main()
