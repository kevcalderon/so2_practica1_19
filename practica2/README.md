**<h1 align="center">PRACTICA 2</h1>**

**<h3 align="center">Control y monitoreo de procesos, fase 2</h3>**

### Datos de los estudiantes

<div align="center">

| Nombre                      | Carné     |
| --------------------------- | --------- |
| Adrian Samuel Molina Cabrera    | 201903850 |
| Carlos Raúl Campos Meléndez | 201800639 |
| Kevin Josué Calderón Peraza | 201902714 |

</div>


# MANUAL TECNICO
* Descripción de la configuración de la Máquina virtual
  Estas son las configuraciones que se realizaron para la creacion de maquina virtual asi como el usuario.
  
<p align="center">
  <img src="https://github.com/kevcalderon/so2_practica2_19/blob/main/imgs/direccion.jpg" width="600">
</p>
<p align="center">
  <img src="https://github.com/kevcalderon/so2_practica2_19/blob/main/imgs/conf.jpg" width="600">
</p>
<p align="center">
  <img src="https://github.com/kevcalderon/so2_practica2_19/blob/main/imgs/grub.jpg" width="600">
</p>
<p align="center">
  <img src="https://github.com/kevcalderon/so2_practica2_19/blob/main/imgs/users.jpg" width="600">
</p>

* Descripción de la configuración de la Máquina virtual
<p align="center">
  <img src="https://github.com/kevcalderon/SO1_201902714/blob/master/Practica2/img/vms.png" width="600">
</p>

* Instrucciones de instalación de Arch Linux
- pacstrap -K /mnt base linux linux-firmware
- genfstab -U /mnt >> /mnt/etc/fstab
- arch-chroot /mnt
- ln -sf /usr/share/zoneinfo/Región/Ciudad /etc/localtime
- hwclock --systohc
- locale-gen
- /etc/locale.conf
- LANG=es_ES.UTF-8
- passwd

Luego se instala la version grafica de gnome para hacer funcionarlo graficamente


* Instrucciones de instalación de los paquetes necesarios para el correcto funcionamiento de la aplicación.

- sudo pacman -S wget
- wget https://go.dev/dl/go1.20.4.linux-amd64.tar.gz
- sudo tar -xvf go1.20.4.linux-amd64.tar.gz -C /usr/local/
- export PATH=$PATH:/usr/local/go/bin

# MANUAL DE USUARIO
* El proyecto fue realizado con la tecnologia de react, con la finalidad de ser mas dinamico las funcionalidades.
* En este se puede visualizar un poligono de frecuencia en el cual indica la ram consumida, asi como tambien los procesos del kernel
* Cada proceso tiene una funcionalidad que es ver nodos hijos, eliminarlo y ver especificamente en otra pantalla el consumo de ese proceso.
  
<p align="center">
  <img src="https://github.com/kevcalderon/so2_practica2_19/blob/main/imgs/front1.jpg" width="600">
</p>
<p align="center">
  <img src="https://github.com/kevcalderon/so2_practica2_19/blob/main/imgs/front2.jpg" width="600">
</p>
<p align="center">
  <img src="https://github.com/kevcalderon/so2_practica2_19/blob/main/imgs/front3.jpg" width="600">
</p>
