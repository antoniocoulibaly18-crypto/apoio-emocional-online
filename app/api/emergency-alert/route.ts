import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { userName, score, maxScore, answers, timestamp } = data

    console.log("[EMERGENCY ALERT]", {
      userName,
      score,
      maxScore,
      timestamp,
      riskLevel: score >= 15 ? "HIGH" : "CRITICAL",
    })

    // In a real application, this would:
    // 1. Send SMS to +244 941 983 180
    // 2. Send email to apoioemocionalangola@gmail.com
    // 3. Trigger emergency protocols
    // 4. Log to database for follow-up

    // Simulate notification sending
    const notificationData = {
      type: "EMERGENCY_ALERT",
      user: userName,
      score: `${score}/${maxScore}`,
      riskLevel: score >= 15 ? "HIGH RISK" : "CRITICAL RISK",
      timestamp: new Date(timestamp).toLocaleString("pt-AO"),
      contact: {
        phone: "+244 941 983 180",
        email: "apoioemocionalangola@gmail.com",
      },
      message: `ALERTA DE EMERGÊNCIA: Usuário ${userName} completou avaliação emocional com pontuação ${score}/${maxScore}. ${
        answers[5] >= 2 ? "ATENÇÃO: Usuário relatou pensamentos sobre se machucar." : ""
      } Contato imediato necessário.`,
    }

    // Log the notification that would be sent
    console.log("[NOTIFICATION SENT]", notificationData)

    return NextResponse.json({
      success: true,
      message: "Emergency alert sent successfully",
      notificationData,
    })
  } catch (error) {
    console.error("[EMERGENCY ALERT ERROR]", error)
    return NextResponse.json({ success: false, error: "Failed to send emergency alert" }, { status: 500 })
  }
}
