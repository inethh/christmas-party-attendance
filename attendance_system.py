import tkinter as tk
from tkinter import ttk, messagebox
import cv2
from pyzbar import pyzbar
import json
import sqlite3
from datetime import datetime
from PIL import Image, ImageTk
import os

class AttendanceSystem:
    def __init__(self, root):
        self.root = root
        self.root.title("Christmas Party Attendance System")
        self.root.geometry("1200x800")
        self.root.configure(bg='#2b2b2b')
        
        # Initialize database
        self.init_database()
        
        # Load initial names list
        self.load_names_list()
        
        # Camera setup
        self.camera = None
        self.scanning = False
        
        # Selected name from QR scan
        self.scanned_name = None
        
        # Setup GUI
        self.setup_gui()
        
    def init_database(self):
        """Initialize SQLite database for attendance tracking"""
        self.conn = sqlite3.connect('attendance.db')
        self.cursor = self.conn.cursor()
        
        # Create tables
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS attendees (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                qr_code TEXT UNIQUE,
                registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS attendance (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                attendee_id INTEGER,
                name TEXT NOT NULL,
                checked_in_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (attendee_id) REFERENCES attendees(id)
            )
        ''')
        
        self.conn.commit()
    
    def load_names_list(self):
        """Load names list from JSON file or create default"""
        if os.path.exists('names_list.json'):
            with open('names_list.json', 'r', encoding='utf-8') as f:
                self.names_list = json.load(f)
        else:
            # Default names list
            self.names_list = [
                "John Doe", "Jane Smith", "Bob Johnson", "Alice Williams",
                "Charlie Brown", "Diana Prince", "Edward Norton", "Fiona Apple"
            ]
            self.save_names_list()
    
    def save_names_list(self):
        """Save names list to JSON file"""
        with open('names_list.json', 'w', encoding='utf-8') as f:
            json.dump(self.names_list, f, indent=2, ensure_ascii=False)
    
    def setup_gui(self):
        """Setup the main GUI"""
        # Main container
        main_frame = tk.Frame(self.root, bg='#2b2b2b')
        main_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=20)
        
        # Title
        title_label = tk.Label(
            main_frame,
            text="🎄 Christmas Party Attendance System 🎄",
            font=('Arial', 24, 'bold'),
            bg='#2b2b2b',
            fg='#ffffff'
        )
        title_label.pack(pady=(0, 20))
        
        # Left and Right panels
        content_frame = tk.Frame(main_frame, bg='#2b2b2b')
        content_frame.pack(fill=tk.BOTH, expand=True)
        
        # Left panel - QR Scanner
        left_panel = tk.Frame(content_frame, bg='#3b3b3b', relief=tk.RAISED, bd=2)
        left_panel.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=(0, 10))
        
        scanner_label = tk.Label(
            left_panel,
            text="QR Code Scanner",
            font=('Arial', 16, 'bold'),
            bg='#3b3b3b',
            fg='#ffffff'
        )
        scanner_label.pack(pady=10)
        
        # Camera display
        self.camera_frame = tk.Frame(left_panel, bg='#1b1b1b', width=400, height=300)
        self.camera_frame.pack(pady=10, padx=10)
        self.camera_frame.pack_propagate(False)
        
        self.camera_label = tk.Label(
            self.camera_frame,
            text="Camera Feed\n\nClick 'Start Scanner' to begin",
            font=('Arial', 12),
            bg='#1b1b1b',
            fg='#888888'
        )
        self.camera_label.pack(expand=True)
        
        # Scanner controls
        control_frame = tk.Frame(left_panel, bg='#3b3b3b')
        control_frame.pack(pady=10)
        
        self.scan_button = tk.Button(
            control_frame,
            text="Start Scanner",
            font=('Arial', 12, 'bold'),
            bg='#4CAF50',
            fg='white',
            activebackground='#45a049',
            activeforeground='white',
            padx=20,
            pady=10,
            command=self.toggle_scanner,
            cursor='hand2'
        )
        self.scan_button.pack(side=tk.LEFT, padx=5)
        
        # Right panel - Name Selection
        right_panel = tk.Frame(content_frame, bg='#3b3b3b', relief=tk.RAISED, bd=2)
        right_panel.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True)
        
        name_label = tk.Label(
            right_panel,
            text="Select Your Name",
            font=('Arial', 16, 'bold'),
            bg='#3b3b3b',
            fg='#ffffff'
        )
        name_label.pack(pady=10)
        
        # Search box
        search_frame = tk.Frame(right_panel, bg='#3b3b3b')
        search_frame.pack(pady=5, padx=10, fill=tk.X)
        
        tk.Label(
            search_frame,
            text="Search:",
            font=('Arial', 10),
            bg='#3b3b3b',
            fg='#ffffff'
        ).pack(side=tk.LEFT, padx=5)
        
        self.search_var = tk.StringVar()
        self.search_var.trace('w', self.filter_names)
        search_entry = tk.Entry(
            search_frame,
            textvariable=self.search_var,
            font=('Arial', 11),
            bg='#2b2b2b',
            fg='#ffffff',
            insertbackground='white'
        )
        search_entry.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=5)
        
        # Names listbox with scrollbar
        list_frame = tk.Frame(right_panel, bg='#3b3b3b')
        list_frame.pack(pady=10, padx=10, fill=tk.BOTH, expand=True)
        
        scrollbar = tk.Scrollbar(list_frame)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        self.names_listbox = tk.Listbox(
            list_frame,
            font=('Arial', 12),
            bg='#2b2b2b',
            fg='#ffffff',
            selectbackground='#4CAF50',
            selectforeground='white',
            yscrollcommand=scrollbar.set,
            height=15
        )
        self.names_listbox.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.config(command=self.names_listbox.yview)
        
        # Bind double-click to register
        self.names_listbox.bind('<Double-Button-1>', self.register_attendance)
        
        # Update names listbox
        self.update_names_listbox()
        
        # Add name option
        add_name_frame = tk.Frame(right_panel, bg='#3b3b3b')
        add_name_frame.pack(pady=10, padx=10, fill=tk.X)
        
        tk.Label(
            add_name_frame,
            text="Name not in list?",
            font=('Arial', 10),
            bg='#3b3b3b',
            fg='#ffffff'
        ).pack(side=tk.LEFT, padx=5)
        
        self.new_name_var = tk.StringVar()
        new_name_entry = tk.Entry(
            add_name_frame,
            textvariable=self.new_name_var,
            font=('Arial', 11),
            bg='#2b2b2b',
            fg='#ffffff',
            insertbackground='white'
        )
        new_name_entry.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=5)
        new_name_entry.bind('<Return>', lambda e: self.add_and_register_name())
        
        add_button = tk.Button(
            add_name_frame,
            text="Add & Register",
            font=('Arial', 10, 'bold'),
            bg='#2196F3',
            fg='white',
            activebackground='#1976D2',
            activeforeground='white',
            padx=10,
            pady=5,
            command=self.add_and_register_name,
            cursor='hand2'
        )
        add_button.pack(side=tk.LEFT, padx=5)
        
        # Register button
        register_button = tk.Button(
            right_panel,
            text="Register Attendance",
            font=('Arial', 14, 'bold'),
            bg='#FF9800',
            fg='white',
            activebackground='#F57C00',
            activeforeground='white',
            padx=30,
            pady=15,
            command=self.register_attendance,
            cursor='hand2'
        )
        register_button.pack(pady=15)
        
        # Status label
        self.status_label = tk.Label(
            right_panel,
            text="Ready to scan QR code",
            font=('Arial', 11),
            bg='#3b3b3b',
            fg='#4CAF50'
        )
        self.status_label.pack(pady=5)
        
        # Bottom panel - Attendance List
        bottom_panel = tk.Frame(main_frame, bg='#3b3b3b', relief=tk.RAISED, bd=2)
        bottom_panel.pack(fill=tk.BOTH, expand=True, pady=(10, 0))
        
        attendance_label = tk.Label(
            bottom_panel,
            text="Registered Attendees",
            font=('Arial', 14, 'bold'),
            bg='#3b3b3b',
            fg='#ffffff'
        )
        attendance_label.pack(pady=10)
        
        # Attendance list with scrollbar
        attendance_list_frame = tk.Frame(bottom_panel, bg='#3b3b3b')
        attendance_list_frame.pack(pady=10, padx=10, fill=tk.BOTH, expand=True)
        
        attendance_scrollbar = tk.Scrollbar(attendance_list_frame)
        attendance_scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        self.attendance_tree = ttk.Treeview(
            attendance_list_frame,
            columns=('Name', 'Time'),
            show='headings',
            yscrollcommand=attendance_scrollbar.set,
            height=8
        )
        self.attendance_tree.heading('Name', text='Name')
        self.attendance_tree.heading('Time', text='Check-in Time')
        self.attendance_tree.column('Name', width=300)
        self.attendance_tree.column('Time', width=200)
        
        # Style the treeview
        style = ttk.Style()
        style.theme_use('clam')
        style.configure('Treeview',
                        background='#2b2b2b',
                        foreground='#ffffff',
                        fieldbackground='#2b2b2b',
                        rowheight=25)
        style.configure('Treeview.Heading',
                        background='#3b3b3b',
                        foreground='#ffffff',
                        relief='flat')
        style.map('Treeview',
                 background=[('selected', '#4CAF50')])
        
        self.attendance_tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        attendance_scrollbar.config(command=self.attendance_tree.yview)
        
        # Refresh button
        refresh_button = tk.Button(
            bottom_panel,
            text="Refresh List",
            font=('Arial', 10),
            bg='#607D8B',
            fg='white',
            activebackground='#455A64',
            activeforeground='white',
            padx=15,
            pady=5,
            command=self.refresh_attendance_list,
            cursor='hand2'
        )
        refresh_button.pack(pady=10)
        
        # Load initial attendance
        self.refresh_attendance_list()
    
    def update_names_listbox(self):
        """Update the names listbox with current names"""
        self.names_listbox.delete(0, tk.END)
        for name in sorted(self.names_list):
            self.names_listbox.insert(tk.END, name)
    
    def filter_names(self, *args):
        """Filter names based on search input"""
        search_term = self.search_var.get().lower()
        self.names_listbox.delete(0, tk.END)
        
        for name in sorted(self.names_list):
            if search_term in name.lower():
                self.names_listbox.insert(tk.END, name)
    
    def toggle_scanner(self):
        """Start or stop QR code scanner"""
        if not self.scanning:
            self.start_scanner()
        else:
            self.stop_scanner()
    
    def start_scanner(self):
        """Start the QR code scanner"""
        try:
            self.camera = cv2.VideoCapture(0)
            if not self.camera.isOpened():
                messagebox.showerror("Error", "Could not open camera. Please check if camera is connected.")
                return
            
            self.scanning = True
            self.scan_button.config(text="Stop Scanner", bg='#f44336', activebackground='#d32f2f')
            self.status_label.config(text="Scanning QR code...", fg='#FF9800')
            self.scan_camera()
        except Exception as e:
            messagebox.showerror("Error", f"Error starting camera: {str(e)}")
            self.scanning = False
    
    def stop_scanner(self):
        """Stop the QR code scanner"""
        self.scanning = False
        if self.camera:
            self.camera.release()
            self.camera = None
        
        self.scan_button.config(text="Start Scanner", bg='#4CAF50', activebackground='#45a049')
        self.camera_label.config(image='', text="Camera Feed\n\nClick 'Start Scanner' to begin")
        self.status_label.config(text="Scanner stopped", fg='#888888')
    
    def scan_camera(self):
        """Continuously scan camera feed for QR codes"""
        if not self.scanning:
            return
        
        ret, frame = self.camera.read()
        if ret:
            # Decode QR codes
            decoded_objects = pyzbar.decode(frame)
            
            # Draw rectangle around QR code and display
            for obj in decoded_objects:
                points = obj.polygon
                if len(points) == 4:
                    pts = [(point.x, point.y) for point in points]
                    for i in range(4):
                        cv2.line(frame, pts[i], pts[(i+1)%4], (0, 255, 0), 2)
                
                qr_data = obj.data.decode('utf-8')
                self.scanned_name = qr_data
                self.handle_qr_scan(qr_data)
            
            # Convert to RGB and display
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frame_resized = cv2.resize(frame_rgb, (400, 300))
            img = Image.fromarray(frame_resized)
            imgtk = ImageTk.PhotoImage(image=img)
            
            self.camera_label.config(image=imgtk, text='')
            self.camera_label.image = imgtk
        
        if self.scanning:
            self.root.after(10, self.scan_camera)
    
    def handle_qr_scan(self, qr_data):
        """Handle QR code scan result"""
        # Stop scanning after successful scan
        self.stop_scanner()
        
        # Check if name exists in list
        if qr_data in self.names_list:
            # Auto-select in listbox
            index = sorted(self.names_list).index(qr_data)
            self.names_listbox.selection_clear(0, tk.END)
            self.names_listbox.selection_set(index)
            self.names_listbox.see(index)
            
            # Auto-register
            self.register_attendance_by_name(qr_data)
        else:
            # Name not in list - show option to add
            self.status_label.config(
                text=f"QR Code: {qr_data}\nName not in list. Please add it below.",
                fg='#FF9800'
            )
            self.new_name_var.set(qr_data)
            messagebox.showinfo(
                "Name Not Found",
                f"QR Code scanned: {qr_data}\n\nThis name is not in the list. Please add it using the 'Add & Register' button."
            )
    
    def add_and_register_name(self):
        """Add new name to list and register attendance"""
        new_name = self.new_name_var.get().strip()
        
        if not new_name:
            messagebox.showwarning("Warning", "Please enter a name.")
            return
        
        # Add to list if not already present
        if new_name not in self.names_list:
            self.names_list.append(new_name)
            self.save_names_list()
            self.update_names_listbox()
            self.search_var.set('')  # Clear search to show all names
        
        # Register attendance
        self.register_attendance_by_name(new_name)
        self.new_name_var.set('')  # Clear input
    
    def register_attendance(self, event=None):
        """Register attendance for selected name"""
        selection = self.names_listbox.curselection()
        if not selection:
            messagebox.showwarning("Warning", "Please select a name from the list.")
            return
        
        selected_name = self.names_listbox.get(selection[0])
        self.register_attendance_by_name(selected_name)
    
    def register_attendance_by_name(self, name):
        """Register attendance for a specific name"""
        try:
            # Check if already registered today
            self.cursor.execute('''
                SELECT * FROM attendance 
                WHERE name = ? AND DATE(checked_in_at) = DATE('now')
            ''', (name,))
            
            if self.cursor.fetchone():
                messagebox.showinfo("Already Registered", f"{name} is already registered for today.")
                self.status_label.config(text=f"{name} - Already registered", fg='#FF9800')
                return
            
            # Register attendance
            self.cursor.execute('''
                INSERT INTO attendance (name, checked_in_at)
                VALUES (?, ?)
            ''', (name, datetime.now().strftime('%Y-%m-%d %H:%M:%S')))
            
            self.conn.commit()
            
            messagebox.showinfo("Success", f"{name} has been registered successfully!")
            self.status_label.config(text=f"{name} - Registered successfully!", fg='#4CAF50')
            
            # Refresh attendance list
            self.refresh_attendance_list()
            
        except Exception as e:
            messagebox.showerror("Error", f"Error registering attendance: {str(e)}")
    
    def refresh_attendance_list(self):
        """Refresh the attendance list display"""
        # Clear existing items
        for item in self.attendance_tree.get_children():
            self.attendance_tree.delete(item)
        
        # Fetch attendance records
        self.cursor.execute('''
            SELECT name, checked_in_at 
            FROM attendance 
            ORDER BY checked_in_at DESC
        ''')
        
        records = self.cursor.fetchall()
        for record in records:
            self.attendance_tree.insert('', 'end', values=record)
    
    def __del__(self):
        """Cleanup on exit"""
        if self.camera:
            self.camera.release()
        if hasattr(self, 'conn'):
            self.conn.close()

def main():
    root = tk.Tk()
    app = AttendanceSystem(root)
    root.mainloop()

if __name__ == "__main__":
    main()

