export type SkillCategory = {
  name: string;
  skills: string[];
};

export const skillCategories: SkillCategory[] = [
  {
    name: "Firmware & RTOS",
    skills: ["FreeRTOS", "Zephyr", "Bare-metal C", "CMSIS", "Bootloaders"],
  },
  {
    name: "Hardware",
    skills: ["STM32", "ESP32", "FPGA", "PCB Design", "Altium", "KiCad"],
  },
  {
    name: "Robotics",
    skills: ["ROS 2", "PID Control", "Sensor Fusion", "Motor Control", "SLAM"],
  },
  {
    name: "Tools",
    skills: ["GCC", "CMake", "JTAG", "Logic Analyzers", "Oscilloscopes"],
  },
  {
    name: "Languages",
    skills: ["C", "C++", "Rust", "Python", "Verilog", "Assembly"],
  },
  {
    name: "Protocols",
    skills: ["CAN", "I2C", "SPI", "UART", "Ethernet", "MQTT"],
  },
];
