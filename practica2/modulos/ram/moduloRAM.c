//Header obligatorio de todos los modulos
#include <linux/module.h>

//Header para usar KERN_INFO
#include <linux/kernel.h>

//Header para las funciones module_init y module_exit
#include <linux/init.h>

//Header necesario porque se usara proc_ops/file_operations
#include <linux/proc_fs.h>

/* for copy_from_user */
#include <asm/uaccess.h>	

/* Header para usar la lib seq_file y manejar el archivo en /proc*/
#include <linux/seq_file.h>

/* Librerias para lectura de procesos */
#include <linux/mm.h>

MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Modulo RAM");
MODULE_AUTHOR("Adrian Molina");

int ram; //Porcentaje de ram

static int writeFile(struct seq_file *archivo, void *v)
{   
    struct sysinfo si;
    si_meminfo(&si);
    seq_printf(archivo, "{\"totalram\":\"%lu\", \n",(si.totalram * si.mem_unit)/1024);
    seq_printf(archivo, "\"freeram\":\"%lu\"", (si.freeram * si.mem_unit)/1024);
    seq_printf(archivo, "} \n");
    return 0;
}

//Funcion que se ejecutara cada vez que se lea el archivo con el comando CAT
static int al_abrir(struct inode *inode, struct file *file)
{
    return single_open(file, writeFile, NULL);
}

//Si el kernel es menor al 5.6 usan file_operations
static struct file_operations operaciones =
{
    .open = al_abrir,
    .read = seq_read
};

//Funcion a ejecuta al insertar el modulo en el kernel con insmod
static int _insert(void){
    proc_create("ram_grupo19", 0, NULL, &operaciones);
    printk(KERN_INFO "Hola mundo, somos el grupo 19 y este es el monitor de RAM\n");
    return 0;
}


//Funcion a ejecuta al remover el modulo del kernel con rmmod
static void _remove(void){
    remove_proc_entry("ram_grupo19", NULL);
    printk(KERN_INFO "Sayonara mundo, somos el grupo 19 y este fue monitor de RAM\n");
}

module_init(_insert);
module_exit(_remove);