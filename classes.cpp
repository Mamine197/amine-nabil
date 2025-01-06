#include<string.h>
#include <iostream>
#include <ctime> 

using namespace std;

class Aeroport{
	private:
	int idAeroport;
	string nomAeroport;
	string ville;
	string pays;
	public:
		void ajouterAeroport(){
			cout<<"entre le nom de Aeroport: ";
			cin>>nomAeroport;
			cout<<"entre la ville de Aeroport: ";
			cin>>ville;
			cout<<"entre le pays de Aeroport: ";
			cin>>pays;
		}
		void afficherAeroport(){
			cout<<"le nom de Aeroport est: "<<this->nomAeroport<<" \n";
			cout<<"la ville de Aeroport est: "<<this->ville<<" \n";
			cout<<"le pays de Aeroport est: "<<this->pays<<" \n";
			
		}
		
	
};

class Escale{
	private:
		int idEscale;
		string heureDepartEscale;
		string heureFinEscale;
	public:
		void ajouterEscale(){
			cout<<"entre l'heure de depart d'escale: ";
			cin>>heureDepartEscale;
			cout<<"entre l'heure de fin d'escale: ";
			cin>>heureFinEscale;
		}
		void afficherEscale(){
			cout<<"l'heure de depart d'escale est: "<<this->heureDepartEscale<<"\n";
			cout<<"l'heure de fin d'escale est: "<<this->heureFinEscale<<"\n";
		}
};

class Client{
	private:
		int idClient;
		string nom;
		string prenom;
		string email;
		string numeroTelephone;
		
	public:
	void authentifier(){
		cout<<"entre votre nom: \n";
		cin>>nom;
		cout<<"entre votre prenom: \n";
		cin>>prenom;
		cout<<"entre votre email: \n";
		cin>>email;
		cout<<"entre votre numero de telephone: \n";
		cin>>numeroTelephone;
	}
	
};

class Reservation{
	private:
		int idReservation;
		string dateReservation;
		string statut;
		
	public:
		void confirmerReservation(){
			this->statut="Confirme";
			
		}
		void annulerReservation(){
			this->statut="Annule";
		}
		
		
};

class Billet{
	private:
		int idBillet;
		string classe;
		int prix;
		
	public:
		void choisirClasse(){
			cout<<"entre la classe de votre reservation : ";
			cin>>classe;
		}
		
		

			
};

class Vol{
	public:
		int idVol;
		string CompagnieAerienne;
		string dateDepart;
		string heureDepart;
		string heureArrivee;
		int prix;
		int placesDisponible;
		Aeroport destination;
		Aeroport depart;
		Escale escale;
		Client client;
		Reservation reservation;
		Billet billet;
		
	public:
		void ajouterVol(){
			cout<<"entre la CompagnieAerienne: \n";
			cin>>CompagnieAerienne;
			cout<<"entre la date de depart de vol: \n";
			cin>>dateDepart;
			cout<<"entre l'heure de depart de vol: \n";
			cin>>heureDepart;
			cout<<"entre l'heure de arrivee de vol: \n";
			cin>>heureArrivee;
			cout<<"entre le prix de vol: \n";
			cin>>prix;
			cout<<"entre les places qui sont disponibles: \n";
			cin>>placesDisponible;
			cout<<"entre les informations de Aeroport de depart de vol: \n";
			depart.ajouterAeroport();
			cout<<"entre les informations de Aeroport de destination de vol: \n";
			destination.ajouterAeroport();
			cout<<"entre les informations d'escale: \n";
			escale.ajouterEscale();
			
				
		}
		void afficherVol(int i){
			cout<<"les informations de vol numero "<<i+1<<": \n\n";
			cout<<"la CompagnieAerienne est: "<<this->CompagnieAerienne<<" \n";
			cout<<"la date de depart de vol est: "<<this->dateDepart<<" \n";
			cout<<"l'heure de depart de vol est: "<<this->heureDepart<<" \n";
			cout<<"l'heure d'arrivee de vol est: "<<this->heureArrivee<<" \n";
			cout<<"le prix de vol est: "<<this->prix<<" \n";
			cout<<"les places disponibles est: "<<this->placesDisponible<<" \n";
			cout<<"les informations de Aeroport de depart: \n";
			depart.afficherAeroport();
			cout<<"les informations de Aeroport d'arrivee: \n";
			destination.afficherAeroport();
			escale.afficherEscale();
		}
		
		int VolPrix(){
			return this->prix;
		}
		
};
