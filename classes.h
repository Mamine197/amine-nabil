#ifndef CLASSES_H
#define CLASSES_H

#include <string>
#include <vector>

class Aeroport {
private:
    int idAeroport;
    std::string nomAeroport;
    std::string ville;
    std::string pays;

public:
    void setNomAeroport(const std::string& nom) { nomAeroport = nom; }
    void setVille(const std::string& v) { ville = v; }
    void setPays(const std::string& p) { pays = p; }
    
    std::string getNomAeroport() const { return nomAeroport; }
    std::string getVille() const { return ville; }
    std::string getPays() const { return pays; }
};

class Vol {
private:
    int idVol;
    std::string compagnieAerienne;
    std::string dateDepart;
    std::string heureDepart;
    std::string heureArrivee;
    double prix;
    int placesDisponibles;
    Aeroport depart;
    Aeroport destination;

public:
    void setCompagnieAerienne(const std::string& comp) { compagnieAerienne = comp; }
    void setDateDepart(const std::string& date) { dateDepart = date; }
    void setHeureDepart(const std::string& heure) { heureDepart = heure; }
    void setHeureArrivee(const std::string& heure) { heureArrivee = heure; }
    void setPrix(double p) { prix = p; }
    void setPlacesDisponibles(int places) { placesDisponibles = places; }
    void setDepart(const Aeroport& aero) { depart = aero; }
    void setDestination(const Aeroport& aero) { destination = aero; }

    std::string getCompagnieAerienne() const { return compagnieAerienne; }
    std::string getDateDepart() const { return dateDepart; }
    std::string getHeureDepart() const { return heureDepart; }
    std::string getHeureArrivee() const { return heureArrivee; }
    double getPrix() const { return prix; }
    int getPlacesDisponibles() const { return placesDisponibles; }
    Aeroport getDepart() const { return depart; }
    Aeroport getDestination() const { return destination; }
};

#endif
