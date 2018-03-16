library(ggplot2)
data <- data.frame(
  VisType = c("Treemap", "PieChart", "BarChart"),
  LogError = c(2.897165, 2.798156, 2.793498),
  low = c(2.71692, 2.601009, 2.601880),
  high = c(3.07741, 2.995303, 2.985117))
p <- ggplot(data, aes(LogError, VisType ))
p + geom_point() + geom_errorbarh(aes(xmax = high, xmin = low, height = 0.1))
