CXX = g++
CXXFLAGS = -std=c++11

all: reservation

reservation: reservation.cpp
	$(CXX) $(CXXFLAGS) -o reservation reservation.cpp

clean:
	rm -f reservation
