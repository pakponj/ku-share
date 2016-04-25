#include<stdio.h>

void main(){
	int i,sum = 0;
	for(i=0;i<1000;++i)
		sum += i;
	printf("%d\n",sum);
}
