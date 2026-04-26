package ai.hishmo.glasses.hud

import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.sp

/**
 * Renders the ASR/MT confidence tier as symbol + weight + animation.
 * No color paint — the waveguide is single-color monochrome.
 * Severity = symbol (⛑ / ⚠ / ◇) + bold/italic weight + position.
 *
 * M0 placeholder: shows the neutral diamond ◇ until the phone pushes a
 * HudFrame.confidence value over the control channel.
 */
@Composable
fun ConfidenceIndicator() {
    Text(
        text = "◇",
        color = Color.White,
        fontSize = 28.sp,
    )
}
