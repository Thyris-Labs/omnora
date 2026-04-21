package environments

type createEnvironmentBody struct {
	Name    string `json:"name" binding:"required"`
	OwnerId string `json:"ownerId" binding:"required"`
}
