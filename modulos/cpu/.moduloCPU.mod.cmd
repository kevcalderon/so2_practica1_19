cmd_/home/kevinc/Escritorio/USAC/SOPES1/Practica2/modulos/cpu/moduloCPU.mod := printf '%s\n'   moduloCPU.o | awk '!x[$$0]++ { print("/home/kevinc/Escritorio/USAC/SOPES1/Practica2/modulos/cpu/"$$0) }' > /home/kevinc/Escritorio/USAC/SOPES1/Practica2/modulos/cpu/moduloCPU.mod