#include<string.h>
#include <iostream>
#include <ctime> 
#include "classes.cpp"

/* run this program using the console pauser or add your own getch, system("pause") or input loop */

int main() {
	
	Vol les_vols[100];
	int choix,client_choix,n,statut;
	
	
	do{
		cout<<"Vous voulez connecter comme admin ou client ? \n";
		cout<<"1-Admin \t\t 2-Client \n";
		cin>>choix;
		
		
		if(choix==1){
			
			cout<<"entre le nombre de vols que vous voulez saisir: \n";
			cin>>n;
			for(int i=0;i<n;i++){
				les_vols[i].ajouterVol();
				cout<<"\n\n";
				
			}
		}
		
		if(choix==2){
			cout<<"\t\t\t Voila , les vols qui sont disponible : \n\n";
			for(int i=0;i<n;i++){
				les_vols[i].afficherVol(i);
				cout<<"\n\n";
			}
			cout<<"entre le vol que tu veux reserver: \n";
			cin>>client_choix;
			les_vols[client_choix-1].client.authentifier();
			cout<<"vous voulez confimer ou annuler reservation: \n";
			cout<<"1-Confirmer \t\t 2-Annuler";
			cin>>statut;
			if(statut==1){
				les_vols[client_choix-1].reservation.confirmerReservation();
			}else if(statut==2){
				les_vols[client_choix-1].reservation.annulerReservation();
			}
			les_vols[client_choix-1].billet.choisirClasse();
			
		}
		
		choix=3;
		
		
	}while(choix!=1 && choix!=2);
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	return 0;
}
