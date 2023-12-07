package com.qudtn.findLandMine.service;

public interface FindLandMineService {
	int[][] makeGame(String mode);

	Object[][] makeGameArray(int[][] landMineArray);
	
	boolean compareArrays(Object[][] originArray, String gameArray);
}
