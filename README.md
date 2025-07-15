# Automatic Lecture Scheduling System (Backend)
This repository contains the backend source code for the Automatic Lecture Scheduling System project. This application is designed to solve the complex problem of creating university lecture schedules efficiently by leveraging a Genetic Algorithm.

The system generates an optimal schedule by considering various constraints, such as lecturer availability, room capacity, and non-overlapping time slots.

Of course! Here is a well-structured and informative README for your repository, written in English.

Automatic Lecture Scheduling System (Backend)
This repository contains the backend source code for the Automatic Lecture Scheduling System project. This application is designed to solve the complex problem of creating university lecture schedules efficiently by leveraging a Genetic Algorithm.

The system generates an optimal schedule by considering various constraints, such as lecturer availability, room capacity, and non-overlapping time slots.


you can acces the frontend repository here : 
🔗 https://github.com/darrenz1212/scheduling-system-frontend



# ✨ Key Features
Automated Scheduling: Automatically generates lecture schedules using a Genetic Algorithm to find the most optimal solution.

Master Data Management: Full CRUD (Create, Read, Update, Delete) operations for essential data like Lecturers, Courses, Rooms, and Time Slots.

Complex Constraint Handling: Manages various hard and soft constraints to produce a valid and efficient schedule.

Secure Authentication: Uses JSON Web Tokens (JWT) to secure API endpoints and ensure that only authenticated users can access the system.

RESTful API Architecture: Built with Express.js to provide a structured and easy-to-integrate API for the frontend application.



# 🧬 How Does It Work?
The core of this system is the Genetic Algorithm, an evolutionary algorithm inspired by the process of natural selection. Here is a simplified workflow:

Population Initialization: The system creates a number of random schedule solutions (individuals) to form an initial population.

Fitness Evaluation: Each individual (schedule) in the population is evaluated and assigned a "fitness score." This score is determined by how many constraints are violated. A schedule with fewer violations has a higher fitness score.

Selection: Individuals with the best fitness scores are selected to become "parents" for the next generation.

Crossover: The selected "parents" exchange genetic information (parts of their schedules) to create new "offspring" (new schedules).

Mutation: Some genes (schedule details) in the new individuals are randomly altered to maintain genetic diversity and avoid local optimal solutions.

Iteration: This process of selection, crossover, and mutation is repeated for multiple generations until a schedule that satisfies all constraints is found or the maximum number of generations is reached.

The final output is a highly optimal and conflict-free lecture schedule.

