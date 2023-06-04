#include <linux/sched.h>
#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/proc_fs.h>
#include <asm/uaccess.h>	
#include <linux/seq_file.h>
#include <linux/hugetlb.h>
#include <linux/mm.h>

MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Modulo CPU");
MODULE_AUTHOR("Kevin Josue Calderon Peraza");

struct task_struct * cpu; //Variable que almacena todos lo procesos
struct task_struct * child; //Variable que almacena un proceso hijo
struct list_head * nodo; //Lista de procesos hijos
int ram; //Porcentaje de ram

static int writeFile(struct seq_file * file, void * v){ 
    int first = 0;
    int first2 = 0;

    seq_printf(file, "{ \"data\": [");
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
        seq_printf(file, "%d", cpu->__state);
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

static int openFile(struct inode * inode, struct file * file){
    return single_open(file, writeFile, NULL);
}

static struct proc_ops operaciones ={
    .proc_open = openFile,
    .proc_read = seq_read
};

static int insertMod(void){
    proc_create("cpu_201902714", 0, NULL, &operaciones);
    printk(KERN_INFO "Kevin Josue Calderon Peraza\n");
    return 0;
}

static void removeMod(void){
    remove_proc_entry("cpu_201902714", NULL);
    printk(KERN_INFO "Primer Semestre 2023\n");
}

module_init(insertMod);
module_exit(removeMod);
