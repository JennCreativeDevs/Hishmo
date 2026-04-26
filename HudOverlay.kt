package ai.hishmo.glasses.hud

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/**
 * Root HUD composable rendered on the Rokid micro-LED waveguide.
 *
 * The waveguide is single-color monochrome, so the HUD draws only white text
 * on a black background. Severity is conveyed by symbol (⛑ / ⚠ / ◇), weight,
 * and position — never by color.
 *
 * Milestone status: this is the M0 placeholder. M1 will replace the static
 * lines below with HudFrame pushes from the phone over the BLE control
 * channel (see transport/ControlChannel.kt) and the live caption stream.
 */
@Composable
fun HudOverlay(modifier: Modifier = Modifier) {
    Box(
        modifier = modifier
            .fillMaxSize()
            .background(Color.Black)
            .padding(20.dp)
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Text(
                text = "HISHMO",
                color = Color.White,
                fontSize = 22.sp,
                fontWeight = FontWeight.Bold,
            )
            Spacer(Modifier.height(8.dp))
            Text(
                text = "Glasses HUD · v0.1.0 (M0)",
                color = Color(0xFFB0B0B0),
                fontSize = 12.sp,
            )
            Spacer(Modifier.height(24.dp))
            Text(
                text = "no record",
                color = Color(0xFFB0B0B0),
                fontSize = 11.sp,
                fontStyle = FontStyle.Italic,
            )
            Spacer(Modifier.height(8.dp))
            Text(
                text = "Waiting for phone link.",
                color = Color.White,
                fontSize = 13.sp,
            )
            Spacer(Modifier.height(4.dp))
            Text(
                text = "Begin consent flow on the phone to start.",
                color = Color(0xFFB0B0B0),
                fontSize = 11.sp,
                fontStyle = FontStyle.Italic,
            )
            Spacer(Modifier.height(20.dp))
            ConfidenceIndicator()
        }
    }
}
