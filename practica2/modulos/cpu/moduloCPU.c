//Header obligatorio de todos los modulos
#include <linux/module.h>
//Header para usar KERN_INFO
#include <linux/kernel.h>

//Header para las funciones module_init y module_exit
#include <linux/init.h>
//Header necesario porque se usara proc_ops/file_operations
#include <linux/proc_fs.h>
/* Header para usar la lib seq_file y manejar el archivo en /proc*/
#include <linux/seq_file.h>

/* Librerias para lectura de procesos */
#include <linux/sched.h>
#include <linux/sched/signal.h>

#include <linux/mm.h>

MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Modulo CPU");
MODULE_AUTHOR("Adrian Molina");

int ram; //Porcentaje de ram

static int writeFile(struct seq_file *file, void *v){
    int first = 0;
    int first2 = 0;

    seq_printf(file, "{ \"data\": [");
    struct task_struct * child; //Variable que almacena un proceso hijo
    struct list_head * nodo; //Lista de procesos hijos
    struct task_struct *cpu; //Variable que almacena un proceso padre
    for_each_process(cpu){
        if(first == 0){
            seq_printf(file, "{");
        }else{
            seq_printf(file, ", {");
        }
        first += 1;
        //Info de un proceso
        seq_printf(file, "\"pid\": ");
        seq_printf(file, "%d", cpu->pid);
        seq_printf(file, ", \"name\": ");
        seq_printf(file, "\"");
        seq_printf(file, "%s", cpu->comm);
        seq_printf(file, "\"");
        seq_printf(file, ", \"user\": ");
        seq_printf(file, "%d", cpu->real_cred->uid);
        seq_printf(file, ", \"state\": ");
        seq_printf(file, "%d", cpu->state);

        if (cpu->mm) {
            ram = (get_mm_rss(cpu->mm)<<PAGE_SHIFT)/(1024*1024);
            seq_printf(file, ", \"ram\": ");
            seq_printf(file, "%d", ram);
        }else{
            seq_printf(file, ", \"ram\": ");
            seq_printf(file, "0");
        }

        seq_printf(file, ", \"children\": ");
        seq_printf(file, "[");
        first2 = 0;

        list_for_each(nodo, &(cpu->children)){
            child = list_entry(nodo, struct task_struct, sibling);

            if(first2 == 0){
                seq_printf(file, "{");
            }else{
                seq_printf(file, ", {");
            }
            first2 += 1;
            seq_printf(file, "\"pid\": ");
            seq_printf(file, "%d", child->pid);
            seq_printf(file, ", \"name\": ");
            seq_printf(file, "\"");
            seq_printf(file, "%s", child->comm);
            seq_printf(file, "\"");
            seq_printf(file, "}");
        }
        seq_printf(file, "]");
        seq_printf(file, "}");
    }


    seq_printf(file, "]}");
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
    proc_create("cpu_grupo19", 0, NULL, &operaciones);
    printk(KERN_INFO "Hola mundo, somos el grupo 19 y este es el monitor de CPU\n");
    return 0;
}


//Funcion a ejecuta al remover el modulo del kernel con rmmod
static void _remove(void){
    remove_proc_entry("cpu_grupo19", NULL);
    printk(KERN_INFO "Sayonara mundo, somos el grupo 19 y este fue monitor de CPU\n");
}

module_init(_insert);
module_exit(_remove);