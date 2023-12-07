package com.qudtn.findLandMine.controller;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.qudtn.findLandMine.service.FindLandMineService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping(value = "/game")
@CrossOrigin(origins = "http://localhost:3000")
public class FindLandMineRestController {
	@Autowired
	private FindLandMineService fmService;

	@PostMapping(value = "/start")
	public ResponseEntity<String> startGame(String mode, HttpSession session) {
		System.out.println(mode);

//		mode = mode.substring(9, 11);

		System.out.println(mode);

		int[][] gameArray = fmService.makeGame(mode);
		Object[][] finalGameArray = fmService.makeGameArray(gameArray);

		if (gameArray.length != 0) {
			ObjectMapper objectmapper = new ObjectMapper();

			String landMineArray;

			try {
				landMineArray = objectmapper.writeValueAsString(finalGameArray);

				session.setAttribute("landMineArray", finalGameArray);
				return ResponseEntity.ok(landMineArray);
			} catch (JsonProcessingException e) {
				return ResponseEntity.badRequest().body("게임 난이도 설정 오류");
			}
		} else {
			return ResponseEntity.badRequest().body("게임 난이도 설정 오류");
		}

	}

	@PostMapping(value = "/id/{id}")
	public ResponseEntity<String> postRank(@PathVariable("id") String id, @RequestParam Map<String, Object> paramMap,
			HttpSession session) {
		System.out.println(id);
		System.out.println(paramMap);

		Object[][] originArray = (Object[][]) session.getAttribute("landMineArray");
		String gameArray = (String) paramMap.get("game");

		boolean isRightArray = fmService.compareArrays(originArray, gameArray);

		paramMap.remove("game");
		paramMap.put("id", id);
		System.out.println(LocalDateTime.now());
//		paramMap.put("datetime",LocalDateTime.now());
		
		if (isRightArray) {
			ObjectMapper objectmapper = new ObjectMapper();
			String rank;
			try {
				rank = objectmapper.writeValueAsString(paramMap);
				return ResponseEntity.ok().body(rank);
			} catch (JsonProcessingException e) {
				e.printStackTrace();
				return ResponseEntity.badRequest().body("서버 오류 발생");
			}
		} else {
			return ResponseEntity.badRequest().body("게임 배열 검증 실패");
		}
	}

}
