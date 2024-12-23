"use client";

import { collection, getDocs } from "@firebase/firestore";
import { myFirestore } from "@/app/firebase/firebase";
import { useEffect, useState } from "react";

export default function Login() {
    const [data, setData] = useState([]); // 사용자 데이터 상태
    const [id, setId] = useState(""); // 입력된 ID
    const [password, setPassword] = useState(""); // 입력된 패스워드
    const [message, setMessage] = useState(""); // 로그인 결과 메시지

    // Firestore에서 데이터 가져오기
    const fetchData = async () => {
        try {
            const querySnapshot = await getDocs(collection(myFirestore, "user"));
            const fetchedData = querySnapshot.docs.map((doc) => ({
                id: doc.id, // 문서 ID 포함
                ...doc.data(),
            }));
            setData(fetchedData); // 가져온 데이터를 상태에 저장
        } catch (error) {
            console.error("데이터를 가져오는 중 오류 발생:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 로그인 처리 함수
    const handleLogin = () => {
        const user = data.find(
            (user) => user.username === id && user.password === password
        );

        if (user) {
            setMessage(user.branch); // 성공 메시지 설정
        } else {
            setMessage("로그인 실패! 아이디 또는 비밀번호를 확인하세요."); // 실패 메시지 설정
        }
    };

    return (
        <div>
            <h1>Login Page</h1>
            <div>
                <label>
                    ID:
                    <input
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
            </div>
            <button onClick={handleLogin}>로그인</button>
            <p>{message}</p>
        </div>
    );
}
