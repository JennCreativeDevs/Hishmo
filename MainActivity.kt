package ai.hishmo.phone

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Surface(modifier = Modifier.fillMaxSize(), color = Color(0xFF0E1116)) {
                    PhonePlaceholder()
                }
            }
        }
    }
}

/**
 * M0 placeholder for the phone app. M4 will replace this with the tabletop
 * split-screen composable (top half = survivor, rotated 180°; bottom half =
 * worker, upright). For now we render a single visible status screen so a
 * fresh install isn't a black surface.
 */
@Composable
private fun PhonePlaceholder() {
    Box(modifier = Modifier
        .fillMaxSize()
        .background(Color(0xFF0E1116))
        .padding(24.dp)) {
        Column(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Text(
                text = "HISHMO",
                color = Color(0xFFE7ECEF),
                fontSize = 32.sp,
                fontWeight = FontWeight.Bold,
            )
            Spacer(Modifier.height(6.dp))
            Text(
                text = "Phone tabletop · v0.1.0 (M0)",
                color = Color(0xFF8B94A3),
                fontSize = 13.sp,
            )
            Spacer(Modifier.height(28.dp))
            Text(
                text = "Tabletop split-screen UI is M4 — not built yet.",
                color = Color(0xFFE7ECEF),
                fontSize = 14.sp,
            )
            Spacer(Modifier.height(8.dp))
            Text(
                text = "For the working demo, open demo/index.html in Chrome.",
                color = Color(0xFF8B94A3),
                fontSize = 12.sp,
                fontStyle = FontStyle.Italic,
            )
            Spacer(Modifier.height(24.dp))
            Text(
                text = "Privacy: nothing leaves the device. No cloud egress.",
                color = Color(0xFF6AD7C1),
                fontSize = 11.sp,
            )
        }
    }
}
