package com.qudtn.findLandMine.service;

import java.util.List;
import java.util.Map;

public interface FindLandMineService {
	int[][] makeGame(String mode);

	int[][] makeGameArray(int[][] landMineArray);
}
